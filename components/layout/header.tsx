'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClientAvatarFallback } from "@/components/client-avatar-fallback";
import { getProfile, logout } from "@/lib/supabase/actions/profile";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ShoppingBag, LogOut, Menu, User } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "My Bag", href: "/bag", button: true },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  const isAuthenticated = !!profile;
  const isHomePage = pathname === "/";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    (async () => {
      const p = await getProfile();
      setProfile(p);
    })();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 supports-[backdrop-filter]:bg-background px-1 md:px-0 border-gray-400 flex justify-center",
        isHomePage && "bg-transparent"
      )}
    >
      <div className="max-w-6xl 2xl:max-w-7xl w-full flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex gap-1 font-bold">
            <ShoppingBag className="h-6 w-6" />
            <h3>
              BAG<span className="text-blue-500 cursor-pointer">LINK</span>
            </h3>
          </div>
        </Link>

        {/* --- NAV LINKS --- */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) =>
                item.button ? (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href}>
                      <Button
                        variant="secondary"
                        className={cn(
                          "mx-10 text-lg hover:underline text-blue-500",
                          isActive(item.href) && "font-bold underline"
                        )}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        "hover:underline mx-10 text-lg lowercase text-blue-500",
                        isActive(item.href) && "font-bold underline"
                      )}
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* --- PERFIL OU LOGIN --- */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profile?.avatar_url || ""}
                      alt={profile?.username || ""}
                      className="object-cover w-full h-full rounded-full"
                    />
                    <AvatarFallback>
                      <ClientAvatarFallback
                        username={profile?.username}
                        email={profile?.email}
                      />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profile?.username}</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${profile?.username}`}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-blue-500 focus:text-destructive"
                  onClick={async () => {
                    await logout();
                    router.push("/");
                    router.refresh();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* --- MENU MOBILE --- */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[280px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <div className="flex flex-col gap-1 text-left">
                  BAG<span className="text-blue-500 cursor-pointer">LINK</span>
                  {isAuthenticated && (
                    <div className="text-sm text-muted-foreground">
                      <p>{profile?.username}</p>
                      <p className="truncate">{profile?.email}</p>
                    </div>
                  )}
                  <ThemeSwitcher />
                </div>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-3 h-[500px]">
                {navItems.map((item) => (
                  <Link href={item.href} key={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "justify-start w-full text-sm",
                        isActive(item.href) && "font-bold underline"
                      )}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}

                {isAuthenticated && (
                  <div className="mt-auto">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
                      onClick={async () => {
                        await logout();
                        router.push("/");
                        router.refresh();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
