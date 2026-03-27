import { Component, createEffect, createSignal } from "solid-js";
import type { Position, PositionFormData } from "./services/types";

interface PositionFormProps {
  initialData?: Position;
  onSubmit: (data: PositionFormData) => void;
  isLoading?: boolean;
}

const PositionForm: Component<PositionFormProps> = (props) => {
  const [formData, setFormData] = createSignal<PositionFormData>({
    category: props.initialData?.category || "",
    des: props.initialData?.des || "",
  });

  createEffect(() => {
    const position = props.initialData;
    setFormData({
      category: position?.category || "",
      des: position?.des || "",
    });
  });

  const handleChange = (field: keyof PositionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="category">Category</label>
        <input
          id="category"
          type="text"
          value={formData().category}
          onChange={(e) => handleChange("category", e.target.value)}
          placeholder="expertise"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="des">Description</label>
        <input
          id="des"
          type="text"
          value={formData().des}
          onChange={(e) => handleChange("des", e.target.value)}
          placeholder="Ahli Regulasi"
          required
          disabled={props.isLoading}
        />
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Position" : "Add Position"}
      </button>
    </form>
  );
};

export default PositionForm;
