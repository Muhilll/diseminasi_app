import { Component, createEffect, createSignal } from "solid-js";
import type {
  Dissemination,
  DisseminationFormData,
} from "./services/types";

interface DisseminationFormProps {
  initialData?: Dissemination;
  currentUserName: string;
  onSubmit: (data: DisseminationFormData) => void;
  isLoading?: boolean;
}

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

const DisseminationForm: Component<DisseminationFormProps> = (props) => {
  const [formData, setFormData] = createSignal<DisseminationFormData>({
    title: props.initialData?.title || "",
    province: props.initialData?.province || "",
    city: props.initialData?.city || "",
    district: props.initialData?.district || "",
    village: props.initialData?.village || "",
    date: formatInputDate(props.initialData?.date),
  });

  createEffect(() => {
    const dissemination = props.initialData;
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

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label>User</label>
        <div class="form-static-value">{props.currentUserName}</div>
        <p class="form-helper-text">Dissemination will be saved under the current login user.</p>
      </div>

      <div class="form-group">
        <label for="title">Title</label>
        <input
          id="title"
          type="text"
          value={formData().title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Dissemination title"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="province">Province</label>
        <input
          id="province"
          type="text"
          value={formData().province}
          onChange={(e) => handleChange("province", e.target.value)}
          placeholder="Province"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="city">City</label>
        <input
          id="city"
          type="text"
          value={formData().city}
          onChange={(e) => handleChange("city", e.target.value)}
          placeholder="City"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="district">District</label>
        <input
          id="district"
          type="text"
          value={formData().district}
          onChange={(e) => handleChange("district", e.target.value)}
          placeholder="District"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="village">Village</label>
        <input
          id="village"
          type="text"
          value={formData().village}
          onChange={(e) => handleChange("village", e.target.value)}
          placeholder="Village"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="date">Date</label>
        <input
          id="date"
          type="date"
          value={formData().date}
          onChange={(e) => handleChange("date", e.target.value)}
          required
          disabled={props.isLoading}
        />
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading
          ? "Loading..."
          : props.initialData
            ? "Update Dissemination"
            : "Add Dissemination"}
      </button>
    </form>
  );
};

export default DisseminationForm;
