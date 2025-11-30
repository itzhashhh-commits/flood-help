import { serverClient } from "@/utils/supabase/server";
import "server-only";

export const getHelpSeekersPins = async () => {
  const client = await serverClient();

  const { data, error } = await client.from("seeking_help").select("*");

  if (error) {
    return { error: error.message, data: null };
  }

  return { data, error: null };
};
