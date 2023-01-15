import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { api } from "../utils/api";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const hello = api.example.hello.useQuery({ text: "from tRPC" });

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
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
        </>
      )}
    </div>
  );
};

export default Home;
