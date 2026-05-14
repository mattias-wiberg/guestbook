import { Suspense } from "react";
import { redirect } from "next/navigation";

import { createServerClient } from "@/lib/supabase/clients/server";

async function ProtectedContent() {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex w-full items-center justify-center">
      <p>
        Hello <span>{data.claims.email}</span>
      </p>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <Suspense>
      <ProtectedContent />
    </Suspense>
  );
}
