import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { UI_TEXT } from "@/lib/UI_Text";
import { shiftService } from "@/services/shiftService";
import { Shift } from "@/types/Shift";

const shiftSchema = z.object({
  name: z.string().min(1, UI_TEXT.FORM.REQUIRED),
  startTime: z.string().min(1, UI_TEXT.FORM.REQUIRED),
  endTime: z.string().min(1, UI_TEXT.FORM.REQUIRED),
});

type ShiftFormValues = z.infer<typeof shiftSchema>;

interface ShiftFormProps {
  initialData?: Shift;
  onSuccess: () => void;
}

const ShiftForm = ({ initialData, onSuccess }: ShiftFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      name: initialData?.name || "",
      startTime: initialData?.startTime || "",
      endTime: initialData?.endTime || "",
    },
  });

  const onSubmit = async (values: ShiftFormValues) => {
    setLoading(true);
    try {
      if (initialData) {
        await shiftService.updateShift(initialData.shiftId, {
          ...values,
          shiftId: initialData.shiftId,
        });
        toast.success(UI_TEXT.SHIFT.UPDATE_SUCCESS);
      } else {
        await shiftService.createShift(values);
        toast.success(UI_TEXT.SHIFT.CREATE_SUCCESS);
      }
      onSuccess();
    } catch (err) {
      toast.error((err as Error).message || UI_TEXT.COMMON.ERROR_UNKNOWN);
    } finally {
      setLoading(false);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  const TimePicker = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
    const [h, m] = (value || "08:00").split(UI_TEXT.COMMON.COLON);

    return (
      <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-sm">
        <Select value={h} onValueChange={(val) => onChange(`${val}:${m}`)}>
          <SelectTrigger className="h-10 w-20 bg-white border-none shadow-none font-bold text-slate-700 focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="font-bold text-slate-300">{UI_TEXT.COMMON.COLON}</span>
        <Select value={m} onValueChange={(val) => onChange(`${h}:${val}`)}>
          <SelectTrigger className="h-10 w-20 bg-white border-none shadow-none font-bold text-slate-700 focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((min) => (
              <SelectItem key={min} value={min}>
                {min}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
      <FieldGroup className="grid grid-cols-1 gap-6">
        <Field>
          <FieldLabel htmlFor="name" className="text-sm font-bold text-slate-700">
            {UI_TEXT.SHIFT.SHIFT_NAME}{" "}
            <span className="text-red-500">{UI_TEXT.COMMON.ASTERISK}</span>
          </FieldLabel>
          <Input
            id="name"
            {...form.register("name")}
            placeholder={UI_TEXT.SHIFT.PLACEHOLDER_NAME}
            className="h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm"
          />
          {form.formState.errors.name && (
            <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel className="text-sm font-bold text-slate-700 mb-2">
              {UI_TEXT.SHIFT.START_TIME}{" "}
              <span className="text-red-500">{UI_TEXT.COMMON.ASTERISK}</span>
            </FieldLabel>
            <TimePicker
              value={form.watch("startTime")}
              onChange={(val) => form.setValue("startTime", val)}
            />
            {form.formState.errors.startTime && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.startTime.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel className="text-sm font-bold text-slate-700 mb-2">
              {UI_TEXT.SHIFT.END_TIME}{" "}
              <span className="text-red-500">{UI_TEXT.COMMON.ASTERISK}</span>
            </FieldLabel>
            <TimePicker
              value={form.watch("endTime")}
              onChange={(val) => form.setValue("endTime", val)}
            />
            {form.formState.errors.endTime && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.endTime.message}</p>
            )}
          </Field>
        </div>
      </FieldGroup>

      <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="h-11 px-8 text-slate-600 hover:bg-slate-50 border-slate-200"
          >
            {UI_TEXT.COMMON.CANCEL}
          </Button>
        </DialogClose>

        <Button
          type="submit"
          disabled={loading}
          className="bg-[#cc0000] hover:bg-[#aa0000] h-11 px-8 shadow-md shadow-red-100 transition-all active:scale-95 text-white"
        >
          {initialData ? UI_TEXT.COMMON.SAVE : UI_TEXT.COMMON.CREATE_NEW}
          {loading && <Spinner className="ml-2" />}
        </Button>
      </div>
    </form>
  );
};

export default ShiftForm;
