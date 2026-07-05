import { createUserStrategyService } from "@/features/strategies/domain";
import { supabase } from "@/lib/supabase/client";

export const useUserStrategyService = () => {
  return createUserStrategyService(supabase);
};

