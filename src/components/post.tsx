import { useSession } from "@supabase/auth-helpers-react";
import React from "react";

const Post = () => {
  const session = useSession();

  return (
    <>
      <h1>Post</h1>
      <p>{session?.user.email}</p>
    </>
  );
};

export default Post;
