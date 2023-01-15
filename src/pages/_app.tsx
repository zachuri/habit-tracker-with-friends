/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { type AppType } from "next/app";

// import { api } from "../utils/api";

// import "../styles/globals.css";

// const MyApp: AppType = ({ Component, pageProps }) => {
//   return <Component {...pageProps} />;
// };

// export default api.withTRPC(MyApp);

import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/auth-helpers-react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}
export default MyApp;
