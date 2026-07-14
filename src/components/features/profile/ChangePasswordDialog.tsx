"use client";

import { CheckCircle2, Circle, KeyRound, Lock } from "lucide-react";
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
import { changePassword } from "@/services/profileService";

const ValidationRules = ({
  value,
  rules,
}: {
  value: string;
  rules: { text: string; test: (v: string) => boolean }[];
}) => {
  return (
    <div className="mt-2 space-y-1">
      {rules.map((rule, idx) => {
        const isMet = rule.test(value || "");
        return (
          <div
            key={idx}
            className={`flex items-center gap-2 text-xs ${isMet ? "text-green-600" : "text-muted-foreground"}`}
          >
            {isMet ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
            <span>{rule.text}</span>
          </div>
        );
      })}
    </div>
  );
};

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
  const isNewPasswordValid = useMemo(() => {
    const v = passwords.new;
    return (
      v.length >= 8 &&
      /[A-Z]/.test(v) &&
      /[a-z]/.test(v) &&
      /[0-9]/.test(v) &&
      /[^A-Za-z0-9]/.test(v) &&
      v !== passwords.current
    );
  }, [passwords.new, passwords.current]);

  const isConfirmValid = passwords.confirm.length > 0 && passwords.confirm === passwords.new;

  const canSubmit =
    !loading && passwords.current.length > 0 && isNewPasswordValid && isConfirmValid;

  // ===== submit =====
  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

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
  }, [canSubmit, passwords]);

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

          <div>
            <FieldPassword
              name="newPassword"
              label={UI_TEXT.CHANGE_PASSWORD.NEW_PASSWORD}
              value={passwords.new}
              onChange={handleChange("new")}
            />
            <ValidationRules
              value={passwords.new}
              rules={[
                { text: UI_TEXT.CHANGE_PASSWORD.MIN_LENGTH, test: (v) => v.length >= 8 },
                { text: UI_TEXT.CHANGE_PASSWORD.UPPERCASE_REQUIRED, test: (v) => /[A-Z]/.test(v) },
                { text: UI_TEXT.CHANGE_PASSWORD.LOWERCASE_REQUIRED, test: (v) => /[a-z]/.test(v) },
                { text: UI_TEXT.CHANGE_PASSWORD.NUMBER_REQUIRED, test: (v) => /[0-9]/.test(v) },
                {
                  text: UI_TEXT.CHANGE_PASSWORD.SPECIAL_CHAR_REQUIRED,
                  test: (v) => /[^A-Za-z0-9]/.test(v),
                },
                {
                  text: UI_TEXT.CHANGE_PASSWORD.NEW_PASSWORD_DIFFERENT,
                  test: (v) => v.length > 0 && v !== passwords.current,
                },
              ]}
            />
          </div>

          <div>
            <FieldPassword
              name="confirmPassword"
              label={UI_TEXT.CHANGE_PASSWORD.CONFIRM_PASSWORD}
              value={passwords.confirm}
              onChange={handleChange("confirm")}
            />
            <ValidationRules
              value={passwords.confirm}
              rules={[
                {
                  text: UI_TEXT.CHANGE_PASSWORD.CONFIRM_MATCH,
                  test: (v) => v.length > 0 && v === passwords.new,
                },
              ]}
            />
          </div>

          {serverError && <p className="text-sm text-destructive text-center">{serverError}</p>}
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
