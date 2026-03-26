import { Component } from "solid-js";
import { A } from "@solidjs/router";

interface SidebarProps {
  sidebarOpen: () => boolean;
  setSidebarOpen: (v: boolean) => void;
  navItems: any[];
  isActive: (path: string) => boolean;
  onLogout: () => void;
}

const Sidebar: Component<SidebarProps> = (props) => {
  return (
    <aside class={`agri-sidebar ${props.sidebarOpen() ? "open" : ""}`}>
      <button class="close-btn" onClick={() => props.setSidebarOpen(false)}>
        ✕
      </button>

      {/* Brand */}
      <div class="sidebar-brand">
        <div class="sidebar-brand-icon">🌿</div>
        <div class="sidebar-brand-text">
          <span class="sidebar-brand-name">Estate Admin</span>
          <span class="sidebar-brand-sub">Management Portal</span>
        </div>
      </div>

      {/* Nav */}
      <nav class="sidebar-nav">
        {props.navItems.map((item) => {
          const Icon = item.icon;

          return (
            <A
              href={item.path}
              class={props.isActive(item.path) ? "active" : ""}
              onClick={() => props.setSidebarOpen(false)}
            >
              {Icon && <Icon />}
              {item.label}
            </A>
          );
        })}
      </nav>

      {/* Bottom */}
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
