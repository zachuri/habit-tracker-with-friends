import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Wrapper for createServerSupabaseClient, used in trpc createContext and the
 * restricted API route
 *
 * @see https://supabase.com/docs/guides/auth/auth-helpers/nextjs
 */

/**
 * It creates a new Supabase server client object, and then uses it to get the current user's session
 * @param {NextApiRequest} req - NextApiRequest - The Next.js API request object
 * @param {NextApiResponse} res - NextApiResponse - The response object from Next.js
 * @returns The session object is being returned.
 */

// Creating a new supabase server client object (e.g. in API route):
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

  return session;
};
