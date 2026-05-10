env "local" {
  src = "file://supabase/schema.sql"
  dev = "postgresql://postgres:postgres@127.0.0.1:54322/atlas_dev?search_path=guestbook&sslmode=disable"
  migration {
    dir = "file://supabase/migrations"
  }
}
