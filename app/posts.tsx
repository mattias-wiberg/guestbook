import { Post } from "@/components/post";
import { createClient } from "@/lib/supabase/server";

export default async function Posts() {
  const supabaseClient = await createClient();
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
    .order("id");
  if (res.error) {
    return `Failed to fetch posts. Please try again. ${res.statusText}(${res.status}): ${res.error.message}`;
    // toast.error("Failed to fetch posts. Please try again.", {
    //   description: `${res.statusText}(${res.status}): ${res.error.message}`,
    // });
  }
  console.log("Fetched posts:", res.data);
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
