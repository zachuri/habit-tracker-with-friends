import { type GetServerSidePropsContext } from "next";

/**
 * Wrapper for unstable_getServerSession, used in trpc createContext and the
 * restricted API route
 *
 * Don't worry too much about the "unstable", it's safe to use but the syntax
 * may change in future versions
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */

// export const getServerAuthSession = async (ctx: {
//   req: GetServerSidePropsContext["req"];
//   res: GetServerSidePropsContext["res"];
// }) => {
//   const  createServerSupabaseClient({
//     ctx.req,
//     ctx.req,
//   })

//   return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
// };

// Creating a new supabase server client object (e.g. in API route):
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

export const getServerAuthSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  });

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  console.log("SESSION +++++-------+++++++: " + session);

  return session;
};
