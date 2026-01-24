import { supabase } from "@/lib/supabase/client";
import { createProfileService } from "@/features/profile/domain";

export const useProfileService = () => {
  return createProfileService(supabase);
};
