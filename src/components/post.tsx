import { useSession } from "@supabase/auth-helpers-react";
import React from "react";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";

const Form = () => {
  const session = useSession();
  const { data, refetch } = api.post.getAll.useQuery();

  const post = api.post.add.useMutation({
    onSuccess() {
      refetch();
      reset();
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const createPost = (data: any) => {
    console.log(data);

    post.mutate({
      title: data.title,
      content: data.content,
      // user_id: session?.user.id as string,
    });

    reset();
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form
      onSubmit={handleSubmit(createPost)}
      className="my-5 flex flex-col border"
    >
      <label className="my-5 text-xl">Title</label>
      <input
        className="mx-10 text-black"
        type="text"
        placeholder="Hello"
        {...register("title", { required: true })}
      />
      <label className="my-5 text-xl">Content</label>
      <input
        className="mx-10 text-black"
        type="text"
        placeholder="This is my post"
        {...register("content", { required: true })}
      />
      <button className="m-5 rounded border border-white">Submit</button>
    </form>
  );
};

const Post = () => {
  const session = useSession();

  const { data, refetch } = api.post.getAll.useQuery();

  return (
    <>
      <h1>Post</h1>
      <p>{session?.user.email}</p>
      <p>{session?.user.id}</p>
      {data?.map((post) => (
        <div key={post.id}>
          {post.title} / {post.content} / {post.id}
        </div>
      ))}
      <Form />
    </>
  );
};

export default Post;
