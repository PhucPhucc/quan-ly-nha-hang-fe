import { Image as ImageIcon, Link2, UploadCloud } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MenuFormType } from "@/hooks/useMenuForm";
import { UI_TEXT } from "@/lib/UI_Text";

interface MenuMediaTabProps {
  form: MenuFormType;
}

export const MenuMediaTab: React.FC<MenuMediaTabProps> = ({ form }) => {
  const { formState, register } = form.formMethods;
  const [previewUrl, setPreviewUrl] = React.useState(form.imageUrl.trim());

  React.useEffect(() => {
    if (!form.selectedImage) {
      setPreviewUrl(form.imageUrl.trim());
      return;
    }

    const objectUrl = URL.createObjectURL(form.selectedImage);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [form.imageUrl, form.selectedImage]);

  return (
    <div className="p-6">
      <Card className="grid gap-6 bg-white shadow-sm border-none p-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="space-y-2">
            <h3 className="text-lg font-bold">{UI_TEXT.MENU.MEDIA_MANAGEMENT_TITLE}</h3>
            <p className="text-neutral-500">{UI_TEXT.MENU.MEDIA_MANAGEMENT_DESC}</p>
          </div>

          <Field className="space-y-2">
            <FieldLabel htmlFor="imageFile">
              <UploadCloud className="h-4 w-4" />
              {UI_TEXT.MENU.MEDIA.UPLOAD_NEW}
            </FieldLabel>
            <FieldContent>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                className="h-12 border-dashed border-2 flex items-center"
                onChange={(event) => {
                  if (event.target.files && event.target.files.length > 0) {
                    form.setSelectedImage(event.target.files[0]);
                    return;
                  }

                  form.setSelectedImage(null);
                }}
              />
              <FieldDescription>
                {form.selectedImage
                  ? UI_TEXT.MENU.MEDIA.SELECTED_FILE(form.selectedImage.name)
                  : UI_TEXT.MENU.MEDIA.UPLOAD_HINT}
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field className="space-y-2">
            <FieldLabel htmlFor="imageUrl">
              <Link2 className="h-4 w-4" />
              {UI_TEXT.MENU.LABEL_IMAGE_URL}
            </FieldLabel>
            <FieldContent>
              <Input
                id="imageUrl"
                data-field-path="imageUrl"
                aria-invalid={!!formState.errors.imageUrl}
                placeholder={UI_TEXT.MENU.PLACEHOLDER_IMAGE_URL}
                className="h-11"
                {...register("imageUrl")}
              />
              <FieldDescription>{UI_TEXT.MENU.MEDIA.HINT_PRIORITY}</FieldDescription>
              <FieldError errors={[formState.errors.imageUrl]} />
            </FieldContent>
          </Field>
        </div>

        <div className="rounded-2xl border border-dashed bg-muted/20 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{UI_TEXT.MENU.MEDIA.PREVIEW}</p>
              <p className="text-xs text-muted-foreground">{UI_TEXT.MENU.MEDIA.CURRENT_IMAGE}</p>
            </div>
            <Badge variant={previewUrl ? "success" : "outline"}>
              {previewUrl ? UI_TEXT.MENU.MEDIA.HAS_IMAGE : UI_TEXT.MENU.MEDIA.NO_IMAGE}
            </Badge>
          </div>

          <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-background">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={form.getValues("name") || UI_TEXT.MENU.LABEL_IMAGE_VIEW}
                className="h-full max-h-[320px] w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <p className="text-sm">{UI_TEXT.MENU.MEDIA.EMPTY}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
