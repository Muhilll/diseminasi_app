import { Component, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import type { NavigationItem } from "./navigation";

interface SidebarProps {
  sidebarOpen: () => boolean;
  setSidebarOpen: (v: boolean) => void;
  navItems: NavigationItem[];
  isLoading: boolean;
  error?: string | null;
  isActive: (path: string) => boolean;
  onLogout: () => void;
}

const Sidebar: Component<SidebarProps> = (props) => {
  const renderNavItems = (items: NavigationItem[], level = 0) => (
    <For each={items}>
      {(item) => (
        <div class="sidebar-nav-group">
          <Show
            when={item.path}
            fallback={
              <div
                class="sidebar-nav-label"
                style={{ "padding-left": `${20 + level * 16}px` }}
              >
                {item.name}
              </div>
            }
          >
            <A
              href={item.path}
              class={props.isActive(item.path) ? "active" : ""}
              style={{ "padding-left": `${20 + level * 16}px` }}
              onClick={() => props.setSidebarOpen(false)}
            >
              {item.name}
            </A>
          </Show>

          <Show when={item.children.length > 0}>
            {renderNavItems(item.children, level + 1)}
          </Show>
        </div>
      )}
    </For>
  );

  return (
    <aside class={`agri-sidebar ${props.sidebarOpen() ? "open" : ""}`}>
      <button class="close-btn" onClick={() => props.setSidebarOpen(false)}>
        x
      </button>

      <div class="sidebar-brand">
        <div class="sidebar-brand-icon">EA</div>
        <div class="sidebar-brand-text">
          <span class="sidebar-brand-name">Estate Admin</span>
          <span class="sidebar-brand-sub">Management Portal</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <Show when={props.isLoading}>
          <div class="sidebar-nav-message">Loading menu...</div>
        </Show>

        <Show when={!props.isLoading && props.error}>
          <div class="sidebar-nav-message error">{props.error}</div>
        </Show>

        <Show when={!props.isLoading && !props.error && props.navItems.length > 0}>
          {renderNavItems(props.navItems)}
        </Show>

        <Show when={!props.isLoading && !props.error && props.navItems.length === 0}>
          <div class="sidebar-nav-message">No menu available.</div>
        </Show>
      </nav>

      <div class="sidebar-bottom">
        <A href="/help" class="sidebar-bottom-item">
          Help Center
        </A>

        <button onClick={props.onLogout} class="sidebar-bottom-item logout">
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
