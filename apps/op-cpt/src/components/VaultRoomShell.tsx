import Image from "next/image";
import Link from "next/link";
import { CalendarDays, FlaskConical, Gavel, Menu, Search, ShoppingBag, UserRound, UsersRound } from "lucide-react";
import { CartDrawer } from "@/components/store/CartDrawer";

const nav = [
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/auctions", label: "Auctions", icon: Gavel },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/grade-lab", label: "Grade Lab", icon: FlaskConical },
  { href: "/community", label: "Community", icon: UsersRound },
  { href: "/consign", label: "Consign", icon: UserRound }
];

export function VaultRoomShell({ children, showCart = true }: { children: React.ReactNode; showCart?: boolean }) {
  return (
    <div className="vault-app">
      <div className="top-ribbon">Cape Town Collector Community</div>
      <header className="site-header">
        <Link className="vault-brand" href="/">
          <Image src="/branding/vault-room-crest.png" alt="" width={74} height={74} priority />
          <span>
            <strong>The Vault Room</strong>
            <em>Cards. Collectibles. Grails.</em>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} key={item.href}>
                <Icon aria-hidden size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="header-tools">
          <button aria-label="Search" type="button">
            <Search aria-hidden size={20} />
          </button>
          <Link href="/profile" aria-label="Profile">
            <Image src="/branding/vault-room-crest.png" alt="" width={38} height={38} />
            <span>Captain</span>
          </Link>
        </div>
      </header>
      <main>{children}</main>
      {showCart && <CartDrawer />}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <Link href="/">
          <Menu aria-hidden size={18} />
          Home
        </Link>
        {nav.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} key={item.href}>
              <Icon aria-hidden size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
