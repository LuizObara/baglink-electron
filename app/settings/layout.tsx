import { SettingsSidebar } from "@/components/settings/settings-sidebar";
// import ProfileCard from "@/components/profile/profile-card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) redirect("/auth/login");

  return (
    <div className="flex">
      <aside className="w-80 border-r px-4 py-6">
        {/* <ProfileCard className="mb-5" /> */}
        <SettingsSidebar />
      </aside>

      <main className="flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}