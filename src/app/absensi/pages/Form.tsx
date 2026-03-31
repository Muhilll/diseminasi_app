import { Component } from "solid-js";
import LookupSelect from "../../../components/ui/LookupSelect";
import { useAbsensiForm } from "../hook/useAbsensiForm";
import { useAbsensiOptions } from "../hook/useAbsensiOptions";
import type { AbsensiFormProps } from "../type/absensi-props";

const AbsensiForm: Component<AbsensiFormProps> = (props) => {
  const { formData, handleChange } = useAbsensiForm({
    initialData: () => props.initialData,
  });
  const { users, isOptionsLoading } = useAbsensiOptions();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <LookupSelect
        id="user_id"
        label="User"
        value={String(formData().user_id)}
        options={users()}
        placeholder="Select user"
        required
        disabled={props.isLoading || isOptionsLoading()}
        getValue={(user) => String(user.id)}
        getLabel={(user) => `${user.name} (${user.employee_id})`}
        onChange={(value) => handleChange("user_id", value)}
      />

      <div class="form-group">
        <label for="gambar">Image URL</label>
        <input
          id="gambar"
          type="text"
          value={formData().gambar}
          onChange={(e) => handleChange("gambar", e.target.value)}
          placeholder="https://..."
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="des">Description</label>
        <textarea
          id="des"
          value={formData().des}
          onInput={(e) => handleChange("des", e.currentTarget.value)}
          placeholder="Attendance description"
          required
          disabled={props.isLoading}
          class="form-textarea"
          rows={4}
        />
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading
          ? "Loading..."
          : props.initialData
            ? "Update Absensi"
            : "Add Absensi"}
      </button>
    </form>
  );
};

export default AbsensiForm;
