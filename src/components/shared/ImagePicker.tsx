"use client";

import { Loader2, Trash2, UploadCloud } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

interface ImagePickerProps {
  file: File | null;
  currentUrl?: string | null;
  onFileChange: (file: File | null) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  uploading?: boolean;
  progress?: number;
}

export default function ImagePicker({
  file,
  currentUrl,
  onFileChange,
  label = UI_TEXT.FORM.IMAGE_LABEL,
  accept = "image/*",
  maxSizeMB = 5,
  disabled,
  uploading = false,
  progress = 0,
}: ImagePickerProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [imgBroken, setImgBroken] = React.useState(false);

  React.useEffect(() => {
    if (!file) {
      setLocalPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const validate = (f: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(f.type)) throw new Error(UI_TEXT.COMMON.FILE_TYPE_ERROR);
    if (f.size > maxSizeMB * 1024 * 1024)
      throw new Error(UI_TEXT.COMMON.FILE_SIZE_ERROR(maxSizeMB));
  };

  const pick = () => inputRef.current?.click();

  const handlePickedFile = async (f: File) => {
    setError(null);
    setImgBroken(false);
    setLoading(true);
    try {
      validate(f);
      onFileChange(f);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : UI_TEXT.COMMON.ERROR_UNKNOWN;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRemove = () => {
    setError(null);
    if (file) {
      onFileChange(null);
    }
  };

  const hasDisplay = (!!localPreview || !!currentUrl) && !imgBroken;
  const isBusy = disabled || loading || uploading;

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) handlePickedFile(f);
  };
  const onPaste = (e: React.ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
    const f = item?.getAsFile();
    if (f) handlePickedFile(f);
  };

  const shellClasses =
    "rounded-xl border border-dashed p-4 bg-muted/20 " + (dragOver ? "ring-2 ring-primary/40" : "");

  return (
    <div className="space-y-2" onPaste={onPaste}>
      {label && <div className="text-sm font-medium">{label}</div>}
      <div
        className={shellClasses}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {hasDisplay ? (
          <div className="space-y-3 relative">
            <img
              src={localPreview || currentUrl || ""}
              alt="preview"
              className="w-full aspect-[4/3] object-cover rounded-lg border"
              onError={() => setImgBroken(true)}
            />

            {(uploading || loading) && (
              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                <div className="flex items-center gap-3 text-white">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">
                    {uploading
                      ? `Đang tải lên... ${Math.max(0, Math.min(100, Math.round(progress)))}%`
                      : UI_TEXT.COMMON.LOADING}{" "}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={pick} disabled={isBusy}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {UI_TEXT.COMMON.LOADING}
                  </>
                ) : (
                  UI_TEXT.BUTTON.CHANGE_IMAGE
                )}
              </Button>

              {file && (
                <Button type="button" variant="destructive" onClick={onRemove} disabled={isBusy}>
                  <Trash2 className="mr-2 h-4 w-4" /> {UI_TEXT.BUTTON.CANCEL_SELECTED_IMAGE}{" "}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
            <div className="text-sm text-muted-foreground">{UI_TEXT.FORM.DROP_OR_PASTE_IMAGE}</div>
            <Button type="button" className="mt-2" onClick={pick} disabled={isBusy}>
              {loading || uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploading ? `Đang tải lên... ${Math.round(progress)}%` : UI_TEXT.COMMON.LOADING}
                </>
              ) : (
                UI_TEXT.BUTTON.SELECT_IMAGE
              )}
            </Button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => e.target.files?.[0] && handlePickedFile(e.target.files[0])}
          disabled={isBusy}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" aria-live="polite">
          {error}
        </p>
      )}
      {imgBroken && (
        <p className="text-sm text-destructive" aria-live="polite">
          {UI_TEXT.FORM.IMAGE_LOAD_ERROR}
        </p>
      )}
    </div>
  );
}
