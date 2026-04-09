"use client";

import { KeyRound, Lock } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import FieldPassword from "@/components/shared/FieldPassword";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { validateNewPassword } from "@/lib/utils";
import { changePassword } from "@/services/profileService";

export default function ChangePasswordDialog() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [open, setOpen] = useState(false);
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

      setOpen(false);
    } catch (err: unknown) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [passwordError, passwords]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-between rounded-2xl py-6 px-4 group hover:border-success hover:bg-success/5 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="bg-success/10 p-2 rounded-xl group-hover:bg-success/20 transition-colors">
              <KeyRound className="h-4 w-4 text-success" />
            </div>
            <span className="font-semibold text-foreground/80">
              {UI_TEXT.CHANGE_PASSWORD.BUTTON}
            </span>
          </div>
          <Lock className="h-4 w-4 text-muted-foreground group-hover:text-success transition-colors" />
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
          <DialogClose asChild>
            <Button type="reset" variant="outline" onClick={() => setOpen(false)}>
              {UI_TEXT.COMMON.CANCEL_EN}
            </Button>
          </DialogClose>

          <Button type="submit" onClick={handleSubmit} disabled={!canSubmit}>
            {loading ? UI_TEXT.COMMON.LOADING : UI_TEXT.BUTTON.SAVE_CHANGES}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
