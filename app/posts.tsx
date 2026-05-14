import { Post } from "@/components/post";
import { createServerClient } from "@/lib/supabase/clients/server";

export default async function Posts() {
  const supabaseClient = await createServerClient();
  const res = await supabaseClient
    .schema("guestbook")
    .from("posts")
    .select(
      `
        id, 
        title, 
        message, 
        created_by (
          id,
          email
        ), 
        created_at
    `,
    )
    .order("created_at", { ascending: false });
  if (res.error) {
    return `Failed to fetch posts. Please try again. ${res.statusText}(${res.status}): ${res.error.message}`;
  }
  const posts = res.data || [];

  return (
    <>
      {posts.map((post) => (
        <Post
          key={post.id}
          title={post.title}
          message={post.message}
          authorEmail={post.created_by.email}
          createdAt={new Date(post.created_at)}
        />
      ))}
    </>
  );
}
