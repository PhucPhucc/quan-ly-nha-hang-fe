"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Flame, GlassWater, Hash, Save, Snowflake } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
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
import { cn } from "@/lib/utils";
import { kdsService, KdsSettingsResponse, KdsSortMode, KdsStationKey } from "@/services/kdsService";

const TEXT = {
  title: "Cấu hình KDS",
  description: "Tùy chỉnh giới hạn WIP và cách ưu tiên hàng đợi cho từng trạm bếp.",
  wipSection: "Giới hạn WIP theo trạm",
  wipSectionDesc: "Thiết lập số món tối đa được nấu đồng thời ở mỗi trạm.",
  prioritySection: "Chính sách ưu tiên",
  prioritySectionDesc:
    "Điều chỉnh trọng số để hệ thống quyết định món nào được đẩy lên trước trong KDS.",
  sortMode: "Chế độ sắp xếp",
  sortModeDesc: "FIFO giữ thứ tự đến trước. Hybrid sẽ kết hợp thời gian chờ và điểm ưu tiên.",
  sortModeOptions: {
    Fifo: "FIFO",
    Hybrid: "Hybrid (Khuyên dùng)",
  } as const,
  wipEnabled: "Bật giới hạn WIP",
  wipLimit: "Giới hạn WIP (Số món)",
  stationLabels: {
    HotKitchen: "Quầy Bếp",
    ColdKitchen: "Bếp lạnh",
    Bar: "Quầy Nước",
  } as Record<KdsStationKey, string>,
  waitWeight: "Điểm chờ mỗi phút",
  waitWeightDesc: "Món chờ càng lâu thì điểm ưu tiên càng tăng.",
  orderPriorityBonus: "Thưởng đơn ưu tiên",
  orderPriorityBonusDesc: "Điểm cộng thêm khi đơn hàng được đánh dấu ưu tiên.",
  expectedTimeWeight: "Trọng số thời gian chế biến",
  expectedTimeWeightDesc: "Món mất nhiều thời gian chế biến sẽ được cộng thêm điểm.",
  overduePerMinute: "Điểm quá hạn mỗi phút",
  overduePerMinuteDesc: "Mỗi phút trễ hơn thời gian dự kiến sẽ được cộng thêm điểm.",
  completionBoost: "Thưởng gần hoàn tất đơn",
  completionBoostDesc: "Tăng ưu tiên cho món thuộc đơn đang gần hoàn tất.",
  takeawayBonus: "Thưởng takeaway",
  takeawayBonusDesc: "Điểm cộng thêm cho đơn mang đi.",
  deliveryBonus: "Thưởng delivery",
  deliveryBonusDesc: "Điểm cộng thêm cho đơn giao hàng.",
  success: "Đã lưu cấu hình KDS thành công",
};

const stationSchema = z.object({
  station: z.enum(["HotKitchen", "ColdKitchen", "Bar"]),
  limit: z.number().int().min(1, "Vui lòng nhập số món tối đa (tối thiểu là 1)"),
  enabled: z.boolean(),
});

const schema = z.object({
  sortMode: z.enum(["Fifo", "Hybrid"]),
  priorityWeights: z.object({
    waitTimePerMinute: z.number().min(0, UI_TEXT.FORM.MIN_VALUE(0)),
    orderPriorityBonus: z.number().min(0, UI_TEXT.FORM.MIN_VALUE(0)),
    expectedTimeWeight: z.number().min(0, UI_TEXT.FORM.MIN_VALUE(0)),
    overduePerMinute: z.number().min(0, UI_TEXT.FORM.MIN_VALUE(0)),
    completionBoostWeight: z.number().min(0, UI_TEXT.FORM.MIN_VALUE(0)),
    takeawayBonus: z.number().min(0, UI_TEXT.FORM.MIN_VALUE(0)),
    deliveryBonus: z.number().min(0, UI_TEXT.FORM.MIN_VALUE(0)),
  }),
  stationWipLimits: z.array(stationSchema).length(3),
});

export type KdsSettingsInput = z.infer<typeof schema>;

const DEFAULT_VALUES: KdsSettingsInput = {
  sortMode: "Hybrid",
  priorityWeights: {
    waitTimePerMinute: 2,
    orderPriorityBonus: 100,
    expectedTimeWeight: 1.5,
    overduePerMinute: 10,
    completionBoostWeight: 50,
    takeawayBonus: 15,
    deliveryBonus: 25,
  },
  stationWipLimits: [
    { station: "HotKitchen", limit: 4, enabled: true },
    { station: "ColdKitchen", limit: 4, enabled: true },
    { station: "Bar", limit: 4, enabled: true },
  ],
};

type FormProps = {
  initialValues?: KdsSettingsInput;
  saving?: boolean;
  onSubmit: (data: KdsSettingsInput) => Promise<void> | void;
};

export function KdsSettingsForm({
  initialValues = DEFAULT_VALUES,
  saving = false,
  onSubmit,
}: FormProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<KdsSettingsInput>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const sortMode = watch("sortMode");

  React.useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <div className="w-full p-4 pb-10 md:p-6 md:pb-12">
      <Card className="mx-auto w-full max-w-4xl border-border shadow-soft pt-5">
        <CardHeader className="gap-1 pb-4">
          <CardTitle className="text-lg">{TEXT.title}</CardTitle>
          <CardDescription>{TEXT.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-6 pb-8 sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">{TEXT.wipSection}</h3>
                <p className="text-sm text-muted-foreground">{TEXT.wipSectionDesc}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {initialValues.stationWipLimits.map((item, index) => {
                  const Icon =
                    item.station === "HotKitchen"
                      ? Flame
                      : item.station === "ColdKitchen"
                        ? Snowflake
                        : GlassWater;

                  return (
                    <div
                      key={item.station}
                      className={cn(
                        "group flex flex-col justify-between space-y-4 rounded-xl border border-border bg-card/40 p-5 shadow-sm transition-all hover:bg-card/80 hover:shadow-md",
                        item.station === "ColdKitchen" && "hidden"
                      )}
                    >
                      <input type="hidden" {...register(`stationWipLimits.${index}.station`)} />
                      <input type="hidden" {...register(`stationWipLimits.${index}.enabled`)} />

                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <h4 className="text-sm font-bold tracking-tight">
                          {TEXT.stationLabels[item.station]}
                        </h4>
                      </div>

                      <Field>
                        <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                          {TEXT.wipLimit}
                        </FieldLabel>
                        <FieldContent>
                          <div className="relative">
                            <Input
                              type="number"
                              min={1}
                              className="h-11 border-2 pl-9 font-mono text-lg font-bold focus:border-primary transition-colors"
                              {...register(`stationWipLimits.${index}.limit`, {
                                valueAsNumber: true,
                              })}
                            />
                            <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary" />
                          </div>
                          <FieldError errors={[errors.stationWipLimits?.[index]?.limit]} />
                        </FieldContent>
                      </Field>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="space-y-6">
              <Field>
                <FieldLabel>{TEXT.sortMode}</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="sortMode"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(["Fifo", "Hybrid"] as KdsSortMode[]).map((option) => (
                            <SelectItem key={option} value={option}>
                              {TEXT.sortModeOptions[option as keyof typeof TEXT.sortModeOptions]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldDescription>{TEXT.sortModeDesc}</FieldDescription>
                  <FieldError errors={[errors.sortMode]} />
                </FieldContent>
              </Field>

              {sortMode === "Hybrid" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-6">
                  <div className="border-t border-border pt-2" />
                  <div>
                    <h3 className="text-sm font-semibold">{TEXT.prioritySection}</h3>
                    <p className="text-sm text-muted-foreground">{TEXT.prioritySectionDesc}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <NumericField
                      label={TEXT.waitWeight}
                      description={TEXT.waitWeightDesc}
                      error={errors.priorityWeights?.waitTimePerMinute}
                    >
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        {...register("priorityWeights.waitTimePerMinute", { valueAsNumber: true })}
                      />
                    </NumericField>

                    <NumericField
                      label={TEXT.expectedTimeWeight}
                      description={TEXT.expectedTimeWeightDesc}
                      error={errors.priorityWeights?.expectedTimeWeight}
                    >
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        {...register("priorityWeights.expectedTimeWeight", { valueAsNumber: true })}
                      />
                    </NumericField>

                    <NumericField
                      label={TEXT.overduePerMinute}
                      description={TEXT.overduePerMinuteDesc}
                      error={errors.priorityWeights?.overduePerMinute}
                    >
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        {...register("priorityWeights.overduePerMinute", { valueAsNumber: true })}
                      />
                    </NumericField>

                    <NumericField
                      label={TEXT.completionBoost}
                      description={TEXT.completionBoostDesc}
                      error={errors.priorityWeights?.completionBoostWeight}
                    >
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        {...register("priorityWeights.completionBoostWeight", {
                          valueAsNumber: true,
                        })}
                      />
                    </NumericField>

                    <NumericField
                      label={TEXT.takeawayBonus}
                      description={TEXT.takeawayBonusDesc}
                      error={errors.priorityWeights?.takeawayBonus}
                    >
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        {...register("priorityWeights.takeawayBonus", { valueAsNumber: true })}
                      />
                    </NumericField>

                    <NumericField
                      label={TEXT.deliveryBonus}
                      description={TEXT.deliveryBonusDesc}
                      error={errors.priorityWeights?.deliveryBonus}
                    >
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        {...register("priorityWeights.deliveryBonus", { valueAsNumber: true })}
                      />
                    </NumericField>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="min-w-36 bg-primary hover:bg-primary-hover"
              >
                {saving ? <Spinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? "Đang lưu..." : "Lưu cấu hình"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function KdsSettingsContainer() {
  const [initialValues, setInitialValues] = React.useState<KdsSettingsInput>(DEFAULT_VALUES);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      setLoading(true);
      try {
        const response = await kdsService.getKdsSettings();
        if (response.isSuccess && response.data && mounted) {
          setInitialValues(mapResponseToInput(response.data));
        }
      } catch {
        toast.error(UI_TEXT.API.NETWORK_ERROR);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (data: KdsSettingsInput) => {
    setSaving(true);
    try {
      // Đảm bảo bật giới hạn WIP cho tất cả các trạm như yêu cầu của khách hàng
      const payload: KdsSettingsInput = {
        ...data,
        stationWipLimits: data.stationWipLimits.map((item) => ({ ...item, enabled: true })),
      };
      const response = await kdsService.updateKdsSettings(payload);
      if (response.isSuccess && response.data) {
        setInitialValues(mapResponseToInput(response.data));
      } else {
        setInitialValues(data);
      }
      toast.success(TEXT.success);
    } catch {
      toast.error(UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return <KdsSettingsForm initialValues={initialValues} saving={saving} onSubmit={handleSubmit} />;
}

function mapResponseToInput(response: KdsSettingsResponse): KdsSettingsInput {
  const normalizedStationWipLimits = DEFAULT_VALUES.stationWipLimits.map((defaultLimit) => {
    return (
      response.stationWipLimits.find(
        (item) => item.station?.toString().toLowerCase() === defaultLimit.station.toLowerCase()
      ) ?? defaultLimit
    );
  });

  const safeSortMode =
    response.sortMode === ("Priority" as string) ? "Hybrid" : (response.sortMode as KdsSortMode);

  return {
    sortMode: safeSortMode ?? DEFAULT_VALUES.sortMode,
    priorityWeights: {
      waitTimePerMinute:
        response.priorityWeights?.waitTimePerMinute ??
        DEFAULT_VALUES.priorityWeights.waitTimePerMinute,
      orderPriorityBonus:
        response.priorityWeights?.orderPriorityBonus ??
        DEFAULT_VALUES.priorityWeights.orderPriorityBonus,
      expectedTimeWeight:
        response.priorityWeights?.expectedTimeWeight ??
        DEFAULT_VALUES.priorityWeights.expectedTimeWeight,
      overduePerMinute:
        response.priorityWeights?.overduePerMinute ??
        DEFAULT_VALUES.priorityWeights.overduePerMinute,
      completionBoostWeight:
        response.priorityWeights?.completionBoostWeight ??
        DEFAULT_VALUES.priorityWeights.completionBoostWeight,
      takeawayBonus:
        response.priorityWeights?.takeawayBonus ?? DEFAULT_VALUES.priorityWeights.takeawayBonus,
      deliveryBonus:
        response.priorityWeights?.deliveryBonus ?? DEFAULT_VALUES.priorityWeights.deliveryBonus,
    },
    stationWipLimits: normalizedStationWipLimits,
  };
}

type NumericFieldProps = {
  label: string;
  description: string;
  error?: { message?: string };
  className?: string;
  children: React.ReactNode;
};

function NumericField({ label, description, error, className, children }: NumericFieldProps) {
  return (
    <Field className={className}>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        {children}
        <FieldDescription>{description}</FieldDescription>
        <FieldError errors={[error]} />
      </FieldContent>
    </Field>
  );
}
