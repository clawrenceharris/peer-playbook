import { supabase } from "@/lib/supabase/client";
import { createSessionService } from "@/features/sessions/domain";

export const useSessionService = () => {
  return createSessionService(supabase);
};
