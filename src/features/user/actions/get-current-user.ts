import { createServerClient } from "@/db/supabase/server";
import { getUserById } from "@/features/user/actions/get-user-by-id";
import { cache } from "react";

export const getCurrentUser = cache(async function () {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return undefined;
  }

  return await getUserById(user.id);
});
