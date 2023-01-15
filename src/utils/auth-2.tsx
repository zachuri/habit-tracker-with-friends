import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
} from "react";
import {
  AuthSession,
  Session,
  SignInWithOAuthCredentials,
  SignInWithPasswordCredentials,
  SignInWithPasswordlessCredentials,
  SignInWithSSO,
  SignUpWithPasswordCredentials,
  User,
} from "@supabase/supabase-js";

interface ContextType {
  session: AuthSession | null | undefined;
  user: User | null | undefined;
  signOut: any;
}

import { supabase } from "./supabase";

// create a context for authentication
export const AuthContext = createContext<ContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // create state values for session, user data  and loading
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get session data if there is an active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ? session : undefined);
    });

    setUser(session?.user ?? null);
    setLoading(false);

    // listen for changes to auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // cleanup the useEffect hook
    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // create signUp, signIn, signOut functions
  const value = {
    signUp: (data: SignUpWithPasswordCredentials) => supabase.auth.signUp(data),
    signIn: (data: SignInWithPasswordCredentials) =>
      supabase.auth.signInWithPassword(data),
    signInOAuth: (data: SignInWithOAuthCredentials) =>
      supabase.auth.signInWithOAuth(data),
    signInOtp: (data: SignInWithPasswordlessCredentials) =>
      supabase.auth.signInWithOtp(data),
    signInSSO: (data: SignInWithSSO) => supabase.auth.signInWithSSO(data),
    signOut: () => supabase.auth.signOut(),
    user,
    session,
  };

  // use a provider to pass down the value
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};
