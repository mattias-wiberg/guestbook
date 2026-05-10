import { AuthButton } from "@/components/auth-button";
import { EnvPopover } from "@/components/env-popover";
import { EnvVarWarning } from "@/components/env-var-warning";
import { Post } from "@/components/post";
import { PostForm } from "@/components/post-form";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import Posts from "./posts";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Next.js Supabase Boilerplate</Link>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <div className="flex-1 flex max-w-5xl py-6">
          <div className="flex flex-col gap-5">
            <PostForm />
            <Suspense>
              <Posts />
            </Suspense>
            <Post
              title="Small Card"
              createdAt={new Date("2024-06-01T12:00:00")}
              authorEmail="mattias.wiberg@outlook.com"
              message='
          The card component supports a size prop that can be set to
          "sm" for a more compact appearance.'
            />
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-2 py-2">
          <ThemeSwitcher />
          <EnvPopover />
        </footer>
      </div>
    </main>
  );
}
