import { createEffect, createSignal } from "solid-js";
import type {
  DisseminationDetail,
  DisseminationDetailFormData,
} from "../type/dissemination-detail";

const formatInputDate = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface UseDisseminationDetailFormParams {
  initialData: () => DisseminationDetail | undefined;
}

export const useDisseminationDetailForm = (
  params: UseDisseminationDetailFormParams,
) => {
  const [formData, setFormData] = createSignal<DisseminationDetailFormData>({
    basis: params.initialData()?.basis || "",
    material: params.initialData()?.material || "",
    date: formatInputDate(params.initialData()?.date),
    location: params.initialData()?.location || "",
    methode: params.initialData()?.methode || "",
    participants: params.initialData()?.participants || "",
    result: params.initialData()?.result || "",
    image: params.initialData()?.image || "",
  });

  createEffect(() => {
    const detail = params.initialData();
    setFormData({
      basis: detail?.basis || "",
      material: detail?.material || "",
      date: formatInputDate(detail?.date),
      location: detail?.location || "",
      methode: detail?.methode || "",
      participants: detail?.participants || "",
      result: detail?.result || "",
      image: detail?.image || "",
    });
  });

  const handleChange = (
    field: keyof DisseminationDetailFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
  };
};
