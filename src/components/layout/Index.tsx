/**
 * AgriIntel Layout Component
 * Sidebar, Header, and Footer matching the AgriIntel Management Portal design
 */
import { Component, JSX, createSignal } from 'solid-js';
import { useNavigate, useLocation, A } from '@solidjs/router';
import { useAuth } from '../../services/authStore';
import './style.css';

// ── Icons (inline SVG components) ──────────────────────────────────────────
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconCrops = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22V12"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
    <path d="M8 6a4 4 0 0 1 8 0c0 4-4 6-4 6S8 10 8 6Z"/>
  </svg>
);
const IconDissemination = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const IconAnalytics = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IconReports = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconHelp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconSignOut = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IconLeaf = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 5.5-8 5.5"/>
  </svg>
);

// ── Nav items ───────────────────────────────────────────────────────────────
const navItems = [
  { label: 'Dashboard',      icon: IconDashboard,      path: '/dashboard' },
  { label: 'Crops',          icon: IconCrops,          path: '/crops' },
  { label: 'Dissemination',  icon: IconDissemination,  path: '/dissemination' },
  { label: 'Analytics',      icon: IconAnalytics,      path: '/analytics' },
  { label: 'Reports',        icon: IconReports,        path: '/reports' },
];

interface LayoutProps {
  children: JSX.Element;
  /** Breadcrumb label shown after "AgriIntel /" in the header */
  pageTitle?: string;
}

const Layout: Component<LayoutProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      <div class="agri-shell">

        {/* ── SIDEBAR ───────────────────────────────────────── */}
        <aside class="agri-sidebar">

          {/* Brand */}
          <div class="sidebar-brand">
            <div class="sidebar-brand-icon">
              <IconLeaf />
            </div>
            <div class="sidebar-brand-text">
              <span class="sidebar-brand-name">Estate Admin</span>
              <span class="sidebar-brand-sub">Management Portal</span>
            </div>
          </div>

          {/* Main nav */}
          <nav class="sidebar-nav">
            {navItems.map(item => (
              <A
                href={item.path}
                class={isActive(item.path) ? 'active' : ''}
              >
                <item.icon />
                {item.label}
              </A>
            ))}
          </nav>

          {/* Bottom actions */}
          <div class="sidebar-bottom">
            <button class="sidebar-nav" style="width:100%;border:none;background:none;">
              <A href="/help" style="width:100%">
                <IconHelp />
                Help Center
              </A>
            </button>
            <button
              onClick={handleLogout}
              class="sidebar-nav"
              style="display:flex;align-items:center;gap:10px;padding:9px 20px;font-size:13.5px;font-weight:500;color:#6b7280;background:none;border:none;width:100%;cursor:pointer;transition:color .15s,background .15s;"
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = '#15803d';
                (e.currentTarget as HTMLElement).style.background = '#f0fdf4';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = '#6b7280';
                (e.currentTarget as HTMLElement).style.background = 'none';
              }}
            >
              <IconSignOut />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN ──────────────────────────────────────────── */}
        <div class="agri-main">

          {/* Header */}
          <header class="agri-header">
            <div class="header-breadcrumb">
              <A href="/dashboard" class="breadcrumb-home">AgriIntel</A>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-page">{props.pageTitle ?? 'Dashboard'}</span>
            </div>
            <div class="header-actions">
              <button class="header-icon-btn" title="Notifications">
                <IconBell />
              </button>
              <button class="header-icon-btn" title="Settings">
                <IconSettings />
              </button>
              <div class="header-user-group">
                <div class="header-avatar">
                  <span class="header-avatar-fallback">A</span>
                </div>
                <span class="header-user-label">Admin</span>
              </div>
            </div>
          </header>

          {/* Page content slot */}
          <main class="agri-content">
            {props.children}
          </main>

          {/* Footer */}
          <footer class="agri-footer">
            <span class="footer-copy">© 2024 Agricultural Intelligence Framework</span>
            <nav class="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/support">Contact Support</a>
            </nav>
          </footer>

        </div>
      </div>
    </>
  );
};

export default Layout;