"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bug } from "lucide-react";
import { EnvBadge, ENVIRONMENT } from "./env-badge";

export function EnvPopover() {
  const supabaseHostname = new URL(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321",
  ).hostname;
  const websiteHostname = new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ).hostname;
  let supabaseEnv: ENVIRONMENT = ENVIRONMENT.PROD;
  if (supabaseHostname.includes(".dev.")) {
    supabaseEnv = ENVIRONMENT.DEV;
  } else if (
    supabaseHostname === "localhost" ||
    supabaseHostname === "127.0.0.1"
  ) {
    supabaseEnv = ENVIRONMENT.LOCALHOST;
  }
  let websiteEnv: ENVIRONMENT = ENVIRONMENT.PROD;
  if (websiteHostname.includes(".dev.")) {
    websiteEnv = ENVIRONMENT.DEV;
  } else if (websiteHostname === "localhost") {
    websiteEnv = ENVIRONMENT.LOCALHOST;
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size={"sm"}>
          <Bug size={16} className={"text-muted-foreground"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <p className="px-2 py-1 text-xs">Environment</p>
        <div className="flex justify-between items-center gap-4 px-2 py-1">
          <span className="text-sm">Website</span>
          <EnvBadge environment={websiteEnv} />
        </div>
        <div className="flex justify-between items-center gap-4 px-2 py-1">
          <span className="text-sm">Supabase</span>
          <EnvBadge environment={supabaseEnv} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
