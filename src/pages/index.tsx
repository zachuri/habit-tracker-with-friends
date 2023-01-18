import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Post from "../components/post";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      {!session ? (
        <div className="mx-auto">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            providers={["google", "facebook", "github"]}
          />
        </div>
      ) : (
        <>
          <h2 className="text-xl">Signed In</h2>
          <Post />
          <button
            className="rounded border-2 p-2"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </>
      )}
    </main>
  );
};

export default Home;
