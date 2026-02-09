"use client";

import { useCallback, useMemo, useState } from "react";

import FieldPassword from "@/components/shared/FieldPassword";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { UI_TEXT } from "@/lib/UI_Text";
import { validateNewPassword } from "@/lib/utils";
import { changePassword } from "@/services/profileService";

export default function ChangePasswordDialog() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (key: "current" | "new" | "confirm") => (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswords((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    },
    []
  );

  // ===== validation =====
  const passwordError = useMemo(() => {
    return validateNewPassword(passwords.new, passwords.confirm);
  }, [passwords.new, passwords.confirm]);

  const canSubmit = !loading && !passwordError && passwords.current;

  // ===== submit =====
  const handleSubmit = useCallback(async () => {
    if (passwordError) return;

    try {
      setLoading(true);
      setServerError("");

      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      });

      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err: unknown) {
      setServerError(String(err));
    } finally {
      setLoading(false);
    }
  }, [passwordError, passwords]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {UI_TEXT.CHANGE_PASSWORD.BUTTON}
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby={undefined} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {UI_TEXT.CHANGE_PASSWORD.TITLE}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="gap-3">
          <FieldPassword
            name="currentPassword"
            label={UI_TEXT.CHANGE_PASSWORD.CURRENT_PASSWORD}
            value={passwords.current}
            onChange={handleChange("current")}
          />

          <FieldPassword
            name="newPassword"
            label={UI_TEXT.CHANGE_PASSWORD.NEW_PASSWORD}
            value={passwords.new}
            onChange={handleChange("new")}
          />

          <FieldPassword
            name="confirmPassword"
            label={UI_TEXT.CHANGE_PASSWORD.CONFIRM_PASSWORD}
            value={passwords.confirm}
            onChange={handleChange("confirm")}
          />

          {(passwordError || serverError) && (
            <p className="text-sm text-destructive text-center">{passwordError || serverError}</p>
          )}
        </FieldGroup>

        <DialogFooter className="flex justify-between gap-2">
          <Button variant="outline">{UI_TEXT.COMMON.CANCEL}</Button>

          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {loading ? UI_TEXT.COMMON.LOADING : UI_TEXT.COMMON.UPDATE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
