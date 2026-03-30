import { createEffect, createSignal } from "solid-js";
import type { Grade, GradeFormData } from "../type/grade";

interface UseGradeFormParams {
  initialData: () => Grade | undefined;
}

export const useGradeForm = (params: UseGradeFormParams) => {
  const [formData, setFormData] = createSignal<GradeFormData>({
    level: params.initialData()?.level || "",
    grade: params.initialData()?.grade || "",
    des: params.initialData()?.des || "",
  });

  createEffect(() => {
    const grade = params.initialData();
    setFormData({
      level: grade?.level || "",
      grade: grade?.grade || "",
      des: grade?.des || "",
    });
  });

  const handleChange = (field: keyof GradeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
  };
};
