"use server";

import { serverClient } from "@/utils/supabase/server";

export const askHelpFormSubmit = async (formData: FormData) => {
  console.log("Submitting form to db");
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string) || "";
  const details = (formData.get("details") as string) || "";
  const coordinates = (formData.get("coordinates") as string) || "";
  const phone = (formData.get("phone") as string) || "";
  const need = (formData.get("need") as string) || "";

  const client = await serverClient();

  const { data, error, statusText } = await client.from("seeking_help").insert({
    name,
    email,
    details,
    coordinates, // store as JSON
    phone,
    need,
  });

  console.log("Form submission result:", { data, error, statusText });
};
