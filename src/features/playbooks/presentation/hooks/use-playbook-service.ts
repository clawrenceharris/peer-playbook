import { createPlaybookService } from "@/features/playbooks/domain";
import { supabase } from "@/lib/supabase/client";

export const usePlaybookService = () => {
  return createPlaybookService(supabase);
};
