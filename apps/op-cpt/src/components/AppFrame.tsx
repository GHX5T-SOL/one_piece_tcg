import Link from "next/link";
import { ShieldCheck, UserRound } from "lucide-react";
import { brand } from "@/lib/seed-data";
import { navItems } from "@/lib/navigation";
import { BrandMark } from "./BrandMark";

type AppFrameProps = {
  children: React.ReactNode;
  active?: string;
  gateLabel?: string;
};

export function AppFrame({ children, active = "", gateLabel = "Member Beta" }: AppFrameProps) {
  return (
    <div className="app-frame">
      <header className="topbar">
        <BrandMark />
        <nav className="topnav" aria-label="Primary navigation">
          {navItems.slice(0, 9).map((item) => {
            const Icon = item.icon;
            const isActive = active === item.href;
            return (
              <Link className={isActive ? "topnav__item is-active" : "topnav__item"} href={item.href} key={item.href}>
                <Icon aria-hidden size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="topbar__actions">
          <a className="social-link social-link--telegram" href={brand.telegramUrl}>
            Join Telegram
          </a>
          <a className="social-link social-link--instagram" href={brand.instagramUrl}>
            Instagram
          </a>
          <Link className="sign-in-button" href="/auth/sign-in">
            <UserRound aria-hidden size={18} />
            Sign in
          </Link>
        </div>
      </header>

      <aside className="side-rail" aria-label="OP CPT sections">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.href;
          return (
            <Link className={isActive ? "side-rail__item is-active" : "side-rail__item"} href={item.href} key={item.href}>
              <Icon aria-hidden size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <div className="side-rail__status">
          <span className="status-dot" />
          127 Nakama online
        </div>
      </aside>

      <main className="app-main">
        <div className="beta-ribbon">
          <ShieldCheck aria-hidden size={16} />
          {gateLabel}
        </div>
        {children}
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.slice(1, 6).map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} key={item.href}>
              <Icon aria-hidden size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
