import { Component } from "solid-js";
import { useAuth } from "../../../services/authStore";
import { useAbsensiForm } from "../hook/useAbsensiForm";
import type { AbsensiFormProps } from "../type/absensi-props";

const AbsensiForm: Component<AbsensiFormProps> = (props) => {
  const auth = useAuth();
  const { formData, handleChange } = useAbsensiForm({
    initialData: () => props.initialData,
  });

  const getImageLabel = () => {
    const gambar = formData().gambar;

    if (gambar instanceof File) {
      return gambar.name;
    }

    if (typeof gambar === "string" && gambar) {
      return "Current image selected";
    }

    return "No file chosen";
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit({
      ...formData(),
      user_id: auth.user()?.id || formData().user_id,
    });
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="user_name">User</label>
        <input
          id="user_name"
          type="text"
          value={auth.user()?.name || "-"}
          disabled
        />
      </div>

      <div class="form-group">
        <label for="gambar">Image</label>
        <div class="file-input-field">
          <label
            for="gambar"
            class={`file-input-button${props.isLoading ? " is-disabled" : ""}`}
          >
            Choose Image
          </label>
          <span class="file-input-name">{getImageLabel()}</span>
          <input
            id="gambar"
            class="file-input-native"
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleChange("gambar", e.currentTarget.files?.[0] || null)
            }
            // required={!props.initialData}
            disabled={props.isLoading}
          />
        </div>
        {typeof formData().gambar === "string" && formData().gambar ? (
          <small class="form-helper-text">Current image is already saved.</small>
        ) : null}
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
