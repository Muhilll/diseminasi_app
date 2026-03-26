import { Component, JSX, createSignal, onMount } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import { useAuth } from "../../services/authStore";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { navigationAPI } from "./navigation";
import type { NavigationItem } from "./navigation";

import "./style.css";

interface LayoutProps {
  children: JSX.Element;
  pageTitle?: string;
}

const filterReadableMenus = (items: NavigationItem[]): NavigationItem[] =>
  items
    .filter((item) => item.permissions?.can_read)
    .map((item) => ({
      ...item,
      children: filterReadableMenus(item.children || []),
    }));

const Layout: Component<LayoutProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [navItems, setNavItems] = createSignal<NavigationItem[]>([]);
  const [isNavLoading, setIsNavLoading] = createSignal(false);
  const [navError, setNavError] = createSignal<string | null>(null);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const fetchNavigation = async () => {
    if (!auth.isAuthenticated()) {
      setNavItems([]);
      return;
    }

    setIsNavLoading(true);
    setNavError(null);

    try {
      const result = await navigationAPI.getMyNavigation();

      if (result.success && result.data) {
        setNavItems(filterReadableMenus(result.data));
      } else {
        setNavItems([]);
        setNavError(result.error || result.message || "Failed to load navigation");
      }
    } catch (error) {
      setNavItems([]);
      setNavError(
        error instanceof Error ? error.message : "Failed to load navigation",
      );
    } finally {
      setIsNavLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  onMount(fetchNavigation);

  return (
    <div class="agri-shell">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navItems={navItems()}
        isLoading={isNavLoading()}
        error={navError()}
        isActive={isActive}
        onLogout={handleLogout}
      />

      {sidebarOpen() && (
        <div class="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div class="agri-main">
        <Header
          pageTitle={props.pageTitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main class="agri-content">{props.children}</main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
