import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { api } from "../utils/api";
import Post from "../components/post";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
        />
      ) : (
        <>
          <p>Signed In</p>
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
          <Post />
        </>
      )}
    </div>
  );
};

export default Home;
