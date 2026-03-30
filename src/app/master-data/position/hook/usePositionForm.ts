import { createEffect, createSignal } from "solid-js";
import type { Position, PositionFormData } from "../type/position";

interface UsePositionFormParams {
  initialData: () => Position | undefined;
}

export const usePositionForm = (params: UsePositionFormParams) => {
  const [formData, setFormData] = createSignal<PositionFormData>({
    category: params.initialData()?.category || "",
    des: params.initialData()?.des || "",
  });

  createEffect(() => {
    const position = params.initialData();
    setFormData({
      category: position?.category || "",
      des: position?.des || "",
    });
  });

  const handleChange = (field: keyof PositionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
  };
};
