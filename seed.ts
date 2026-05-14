/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 */
import { faker } from "@faker-js/faker";
import { AdminUserAttributes, createClient } from "@supabase/supabase-js";
import { Database } from "./lib/supabase/database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Secret key from `supabase status` — safe to hardcode for local dev only
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const clearDatabase = async (
  supabase: ReturnType<typeof createClient<Database>>,
) => {
  // Clear users
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  for (const user of existingUsers?.users ?? []) {
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) console.error("Failed to delete user:", error.message);
  }
};

const main = async () => {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await clearDatabase(supabase);

  // Seed 10 users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user: AdminUserAttributes = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    users.push(user);
  }
  for (const user of users) {
    const { error } = await supabase.auth.admin.createUser({
      ...user,
      email_confirm: true,
    });
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    console.log("Created user:", user);
  }

  // Seed 10 posts
  const posts: Database["guestbook"]["Tables"]["posts"]["Insert"][] = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      title: faker.lorem.sentence({ min: 1, max: 3 }),
      message: faker.lorem.paragraph({ min: 1, max: 3 }),
      created_by: users[i % users.length].id,
      created_at: faker.date.past().toISOString(),
    });
  }
  const { error } = await supabase
    .schema("guestbook")
    .from("posts")
    .insert(posts);
  if (error) throw new Error(`Failed to create posts: ${error.message}`);

  console.log("Seed complete!");
  process.exit();
};

main();
