"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@/lib/supabase/clients/browser";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
