import { createEffect, createSignal } from "solid-js";
import type { User, UserFormData } from "../type/user";

interface UseUserFormParams {
  initialData: () => User | undefined;
}

export const useUserForm = (params: UseUserFormParams) => {
  const [formData, setFormData] = createSignal<UserFormData>({
    email: params.initialData()?.email || "",
    password: "",
    employee_id: params.initialData()?.employee_id || "",
    name: params.initialData()?.name || "",
    grade_id: params.initialData()?.grade_id
      ? String(params.initialData()!.grade_id)
      : "",
    position_id: params.initialData()?.position_id
      ? String(params.initialData()!.position_id)
      : "",
    signature_image: params.initialData()?.signature_image || "",
    role_id: params.initialData()?.role_id
      ? String(params.initialData()!.role_id)
      : "",
  });

  createEffect(() => {
    const user = params.initialData();

    setFormData({
      email: user?.email || "",
      password: "",
      employee_id: user?.employee_id || "",
      name: user?.name || "",
      grade_id: user?.grade_id ? String(user.grade_id) : "",
      position_id: user?.position_id ? String(user.position_id) : "",
      signature_image: user?.signature_image || "",
      role_id: user?.role_id ? String(user.role_id) : "",
    });
  });

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
  };
};
