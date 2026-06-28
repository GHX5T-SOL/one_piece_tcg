import {
  Anchor,
  BadgeDollarSign,
  CalendarDays,
  Crown,
  Gavel,
  Gem,
  Home,
  LibraryBig,
  Newspaper,
  ScanLine,
  ShipWheel,
  Users
} from "lucide-react";

export const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Harbor", href: "/app", icon: ShipWheel },
  { label: "Collection", href: "/collection", icon: LibraryBig },
  { label: "Scanner", href: "/collection#scanner", icon: ScanLine },
  { label: "Trades", href: "/trades", icon: Anchor },
  { label: "Market", href: "/market", icon: BadgeDollarSign },
  { label: "Vault Credit", href: "/vault-credit", icon: Gem },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Rankings", href: "/rankings", icon: Crown },
  { label: "Group Buys", href: "/group-buys", icon: Users },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Admin", href: "/admin", icon: Gavel }
];
