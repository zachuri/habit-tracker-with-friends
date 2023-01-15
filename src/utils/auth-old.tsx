import { AuthSession, Session } from "@supabase/supabase-js";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "./supabase";

type State = {
  session: AuthSession | null | undefined;
};

export const AuthContext = createContext<State | undefined>(undefined);

function AuthContextProvider({ children }: { children: ReactNode }) {
  /**
   * What the session state can tell us:
   * - undefined: The session is being loaded.
   * - null: The session is fetched and is unavailable.
   * - AuthSession: There is a session.
   */
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  // create state values for user data and loading
  // const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * About the "Setting a timer for a long period of time..." warning:
     *
     * Take a look at this GitHub response: https://github.com/facebook/react-native/issues/12981#issuecomment-652745831
     * It says:
     *
     * > If you don't mind having your timer get activated later when the app is
     * > foregrounded again, then I think ignoring the YellowBox warning is a good idea.
     *
     * The timer is for the token refresh task, from GoTrueClient.js. When the access token is expired,
     *  the access token needs to be refreshed. For a 1 hour JWT expiration duration on Supabase,
     *  it is scheduled when 59 minutes has passed. If it could not run at that specific time
     *  because the app were not foregrounded, then the access token would be refreshed as
     *  soon as the app is opened up. If it succeeded, the authentication is conserved. Otherwise,
     *  the session would be expired, requiring the user for a re-login.
     *
     * Therefore, we can safely ignore this warning. Even in the case of the user making requests
     *  while the token is being refreshed, they should fail as they are using the expired token.
     *  The failed requests should be handled accordingly instead of bringing the app to a halt.
     *  The refresh should be fast enough.
     */
    // LogBox.ignoreLogs(["Setting a timer"]);

    /**
     * Fixing the "login screen flashing on app open" problem:
     *
     * The session could be immediately fetched on the web. But we might be using Native here.
     *
     * So if it's Native, we would keep the session as undefined if it's not already been fetched before.
     *  We would then go visit the AsyncStorage, if it doesn't have a session, the session would be null.
     *  If it has, keep the current session state because the onAuthStateChange would setSession for us later.
     *  It might even have done that before our check.
     */

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ? session : undefined);
    });

    // Set the current user
    // setUser(session?.user ?? null);
    setLoading(false);

    // (async () => {
    //   if (isBrowser()) return;
    //   const storageSession = await AsyncStorageLib.getItem(
    //     "supabase.auth.token",
    //   );
    //   if (!storageSession) {
    //     setSession((oldSession) =>
    //       oldSession === undefined ? null : oldSession,
    //     );
    //   }
    // })();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setLoading(false);
      }
    );

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Cache the session value
  const value = useMemo(
    () => ({
      session,
    }),
    [session]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      `useAuthContext must be used within a AuthContextProvider.`
    );
  }
  return context;
};

const useAuthUser = () => {
  const { session } = useAuthContext();
  if (session === undefined) return undefined;
  return session?.user ?? null;
};

const useAuthSession = () => {
  const { session } = useAuthContext();
  if (session === undefined) return undefined;
  return session ?? null;
};

export { AuthContextProvider, useAuthContext, useAuthUser, useAuthSession };
