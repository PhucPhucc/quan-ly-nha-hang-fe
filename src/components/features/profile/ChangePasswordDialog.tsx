"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { changePassword } from "@/services/profileService";

export default function ChangePasswordDialog() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError(UI_TEXT.CHANGE_PASSWORD.CONFIRM_NOT_MATCH);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await changePassword({ currentPassword, newPassword });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {UI_TEXT.CHANGE_PASSWORD.BUTTON}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{UI_TEXT.CHANGE_PASSWORD.TITLE}</DialogTitle>
        </DialogHeader>

        <FieldGroup className="space-y-4">
          {/* Current password */}
          <Field>
            <FieldLabel>{UI_TEXT.CHANGE_PASSWORD.CURRENT_PASSWORD}</FieldLabel>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          {/* New password */}
          <Field>
            <FieldLabel>{UI_TEXT.CHANGE_PASSWORD.NEW_PASSWORD}</FieldLabel>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          {/* Confirm password */}
          <Field>
            <FieldLabel>{UI_TEXT.CHANGE_PASSWORD.CONFIRM_PASSWORD}</FieldLabel>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </FieldGroup>

        <DialogFooter className="flex justify-between gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {UI_TEXT.COMMON.CANCEL}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? UI_TEXT.COMMON.LOADING : UI_TEXT.COMMON.UPDATE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
