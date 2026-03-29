import { Component, createEffect, createSignal, onMount } from "solid-js";
import LookupSelect from "../../../components/ui/LookupSelect";
import { menuAPI } from "./services/api";
import type { Menu, MenuFormData } from "./services/types";

interface MenuFormProps {
  initialData?: Menu;
  onSubmit: (data: MenuFormData) => void;
  isLoading?: boolean;
}

const MenuForm: Component<MenuFormProps> = (props) => {
  const [menus, setMenus] = createSignal<Menu[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = createSignal(false);

  const [formData, setFormData] = createSignal<MenuFormData>({
    name: props.initialData?.name || "",
    path: props.initialData?.path || "",
    icon: props.initialData?.icon || "",
    parent_id: props.initialData?.parent_id ? String(props.initialData.parent_id) : "",
  });

  createEffect(() => {
    const menu = props.initialData;
    setFormData({
      name: menu?.name || "",
      path: menu?.path || "",
      icon: menu?.icon || "",
      parent_id: menu?.parent_id ? String(menu.parent_id) : "",
    });
  });

  const handleChange = (field: keyof MenuFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  const loadMenus = async () => {
    setIsOptionsLoading(true);
    try {
      const result = await menuAPI.getAll();
      if (result.success && result.data) {
        setMenus(result.data);
      }
    } finally {
      setIsOptionsLoading(false);
    }
  };

  onMount(loadMenus);

  const parentOptions = () =>
    menus().filter((menu) => menu.id !== props.initialData?.id);

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData().name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Dashboard"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="path">Path</label>
        <input
          id="path"
          type="text"
          value={formData().path}
          onChange={(e) => handleChange("path", e.target.value)}
          placeholder="/dashboard"
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="icon">Icon</label>
        <input
          id="icon"
          type="text"
          value={formData().icon}
          onChange={(e) => handleChange("icon", e.target.value)}
          placeholder="home"
          disabled={props.isLoading}
        />
      </div>

      <LookupSelect
        id="parent_id"
        label="Parent Menu"
        value={formData().parent_id}
        options={parentOptions()}
        placeholder="Select parent menu"
        disabled={props.isLoading || isOptionsLoading()}
        getValue={(menu) => String(menu.id)}
        getLabel={(menu) => menu.name}
        onChange={(value) => handleChange("parent_id", value)}
      />

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Menu" : "Add Menu"}
      </button>
    </form>
  );
};

export default MenuForm;
