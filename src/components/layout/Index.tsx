import { Component, JSX, createSignal } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import { useAuth } from "../../services/authStore";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

import "./style.css";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Crops", path: "/crops" },
  { label: "Dissemination", path: "/dissemination" },
  { label: "Analytics", path: "/analytics" },
  { label: "Reports", path: "/reports" },
];

interface LayoutProps {
  children: JSX.Element;
  pageTitle?: string;
}

const Layout: Component<LayoutProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <div class="agri-shell">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navItems={navItems}
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