"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/supabase/actions/profile";

export default function BagPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      router.push(`/bag/${profile?.username || "unknown"}`);
    })();
  }, [router]);

  return null;
}
