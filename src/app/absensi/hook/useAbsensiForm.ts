import { createEffect, createSignal } from "solid-js";
import type { AbsensiFormData, Absensi } from "../type/absensi";

interface UseAbsensiFormParams {
  initialData: () => Absensi | undefined;
}

const createInitialFormData = (absensi?: Absensi): AbsensiFormData => ({
  gambar: absensi?.gambar || "",
  des: absensi?.des || "",
  user_id: absensi?.user_id || "",
});

export const useAbsensiForm = (params: UseAbsensiFormParams) => {
  const [formData, setFormData] = createSignal<AbsensiFormData>(
    createInitialFormData(params.initialData()),
  );

  createEffect(() => {
    setFormData(createInitialFormData(params.initialData()));
  });

  const handleChange = (field: keyof AbsensiFormData, value: string | number) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return {
    formData,
    handleChange,
  };
};
