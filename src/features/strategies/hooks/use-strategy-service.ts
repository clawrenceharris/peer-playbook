import { createStrategyService } from "@/features/strategies/domain";
import { supabase } from "@/lib/supabase/client";


export const useStrategyService = () => {
  return createStrategyService(supabase);
};
