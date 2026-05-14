declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
    SUPABASE_SECRET_KEY: string;

    // Next.js built-ins
    NODE_ENV: "development" | "production" | "test";
    NEXT_PUBLIC_VERCEL_URL?: string;
  }
}
