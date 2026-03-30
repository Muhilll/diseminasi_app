import { createEffect, createSignal } from "solid-js";
import type { Dissemination, DisseminationFormData } from "../type/dissemination";

const formatInputDate = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface UseDisseminationFormParams {
  initialData: () => Dissemination | undefined;
}

export const useDisseminationForm = (params: UseDisseminationFormParams) => {
  const [formData, setFormData] = createSignal<DisseminationFormData>({
    title: params.initialData()?.title || "",
    province: params.initialData()?.province || "",
    city: params.initialData()?.city || "",
    district: params.initialData()?.district || "",
    village: params.initialData()?.village || "",
    date: formatInputDate(params.initialData()?.date),
  });

  createEffect(() => {
    const dissemination = params.initialData();
    setFormData({
      title: dissemination?.title || "",
      province: dissemination?.province || "",
      city: dissemination?.city || "",
      district: dissemination?.district || "",
      village: dissemination?.village || "",
      date: formatInputDate(dissemination?.date),
    });
  });

  const handleChange = (field: keyof DisseminationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
  };
};
