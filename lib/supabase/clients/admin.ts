import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

export async function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
  );
}
