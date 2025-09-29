"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  UserCircle,
  ShieldCheck,
  Bell,
  Settings,
} from "lucide-react"; 

const links = [
  { href: "/settings/profile", label: "Perfil", icon: UserCircle },
  { href: "/settings/account", label: "Conta", icon: Settings },
  { href: "/settings/security", label: "Segurança", icon: ShieldCheck },
  { href: "/settings/notifications", label: "Notificações", icon: Bell },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted",
            pathname === href
              ? "bg-muted text-primary border-l-2 border-red-400"
              : "text-muted-foreground"
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}