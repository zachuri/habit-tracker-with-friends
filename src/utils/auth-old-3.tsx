// Using an react-supabase hook for supabase auth

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthStateChange, useClient } from "react-supabase";
import { supabase } from "./supabase";
import {
  AuthSession,
  Session,
  SupabaseClient,
  User,
} from "@supabase/supabase-js";

type ContextType = {
  session: AuthSession | null | undefined;
  // user: User | null | undefined;
  // client: SupabaseClient<any, "public", any>;
};

export const AuthContext = createContext<ContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Using my supabase client
  const client = useClient();

  // State for session and user
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [user, setUser] = useState<User | null | undefined>(null);

  useEffect(() => {
    // const session = client.auth.getSession();
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session ? session : undefined);
      setUser(session?.user ?? null);
    });

    // listen for changes to auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // cleanup the useEffect hook
    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // useAuthStateChange((event, session) => {
  //   console.log(`Supabase auth event: ${event}`, session);
  //   // setSession(session);
  //   // setUser(session?.user ?? null);
  // });

  // Cache the session value
  const value = useMemo(
    () => ({
      session,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw Error("useAuth must be used within AuthProvider");
  return context;
}
