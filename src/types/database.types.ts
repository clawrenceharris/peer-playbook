export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      activity_executions: {
        Row: {
          activity_id: string;
          completed_at: string | null;
          id: string;
          results: Json | null;
          session_id: string;
          started_at: string;
          state: Json;
        };
        Insert: {
          activity_id: string;
          completed_at?: string | null;
          id?: string;
          results?: Json | null;
          session_id: string;
          started_at?: string;
          state?: Json;
        };
        Update: {
          activity_id?: string;
          completed_at?: string | null;
          id?: string;
          results?: Json | null;
          session_id?: string;
          started_at?: string;
          state?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "activity_executions_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      activity_responses: {
        Row: {
          block_id: string;
          execution_id: string;
          id: string;
          participant_id: string;
          response: Json;
          submitted_at: string;
        };
        Insert: {
          block_id: string;
          execution_id: string;
          id?: string;
          participant_id: string;
          response: Json;
          submitted_at?: string;
        };
        Update: {
          block_id?: string;
          execution_id?: string;
          id?: string;
          participant_id?: string;
          response?: Json;
          submitted_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activity_responses_execution_id_fkey";
            columns: ["execution_id"];
            isOneToOne: false;
            referencedRelation: "activity_executions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activity_responses_participant_id_fkey";
            columns: ["participant_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      playbook_strategies: {
        Row: {
          slug: string;
          category: string;
          created_at: string;
          description: string;
          id: string;
          phase: Database["public"]["Enums"]["lesson_phase"];
          playbook_id: string;
          position: number;
          source_id: string | null;
          source_type: string | null;
          steps: string[];
          title: string;
          updated_at: string | null;
          virtualized: boolean | null;
        };
        Insert: {
          slug?: string;
          category: string;
          created_at?: string;
          description?: string;
          id?: string;
          phase: Database["public"]["Enums"]["lesson_phase"];
          playbook_id: string;
          position: number;
          source_id?: string | null;
          source_type?: string | null;
          steps: string[];
          title: string;
          updated_at?: string | null;
          virtualized?: boolean | null;
        };
        Update: {
          slug?: string;
          category?: string;
          created_at?: string;
          description?: string;
          id?: string;
          phase?: Database["public"]["Enums"]["lesson_phase"];
          playbook_id?: string;
          position?: number;
          source_id?: string | null;
          source_type?: string | null;
          steps?: string[];
          title?: string;
          updated_at?: string | null;
          virtualized?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_cards_lesson_id_fkey";
            columns: ["playbook_id"];
            isOneToOne: false;
            referencedRelation: "playbooks";
            referencedColumns: ["id"];
          },
        ];
      };
      playbooks: {
        Row: {
          course_name: string | null;
          created_at: string;
          createdBy: string | null;
          id: string;
          published: boolean | null;
          subject: string;
          topic: string;
          updated_at: string | null;
        };
        Insert: {
          course_name?: string | null;
          created_at?: string;
          createdBy?: string | null;
          id?: string;
          published?: boolean | null;
          subject: string;
          topic: string;
          updated_at?: string | null;
        };
        Update: {
          course_name?: string | null;
          created_at?: string;
          createdBy?: string | null;
          id?: string;
          published?: boolean | null;
          subject?: string;
          topic?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "playbooks_owner_fkey";
            columns: ["createdBy"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          courses: string[] | null;
          created_at: string;
          email: string | null;
          first_name: string;
          id: string;
          last_name: string | null;
          onboarding_completed_at: string | null;
          role: Database["public"]["Enums"]["user_role"] | null;
          school: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          courses?: string[] | null;
          created_at?: string;
          email?: string | null;
          first_name: string;
          id?: string;
          last_name?: string | null;
          onboarding_completed_at?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          school?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          courses?: string[] | null;
          created_at?: string;
          email?: string | null;
          first_name?: string;
          id?: string;
          last_name?: string | null;
          onboarding_completed_at?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          school?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      saved_playbooks: {
        Row: {
          created_at: string | null;
          id: string;
          playbook_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          playbook_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          playbook_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_playbookss_playbook_id_fkey";
            columns: ["playbook_id"];
            isOneToOne: false;
            referencedRelation: "playbooks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_playbookss_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      session_contexts: {
        Row: {
          context: string;
          created_at: string;
          id: string;
        };
        Insert: {
          context: string;
          created_at?: string;
          id?: string;
        };
        Update: {
          context?: string;
          created_at?: string;
          id?: string;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          call_id: string | null;
          course_name: string | null;
          created_at: string;
          description: string | null;
          id: string;
          instructor_id: string | null;
          mode: Database["public"]["Enums"]["session_mode"];
          playbook_id: string | null;
          scheduled_start: string;
          session_code: string | null;
          status: Database["public"]["Enums"]["session_status"];
          topic: string | null;
          updated_at: string;
          virtual: boolean;
        };
        Insert: {
          call_id?: string | null;
          course_name?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          instructor_id?: string | null;
          mode: Database["public"]["Enums"]["session_mode"];
          playbook_id?: string | null;
          scheduled_start?: string;
          session_code?: string | null;
          status?: Database["public"]["Enums"]["session_status"];
          topic?: string | null;
          updated_at?: string;
          virtual?: boolean;
        };
        Update: {
          call_id?: string | null;
          course_name?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          instructor_id?: string | null;
          mode?: Database["public"]["Enums"]["session_mode"];
          playbook_id?: string | null;
          scheduled_start?: string;
          session_code?: string | null;
          status?: Database["public"]["Enums"]["session_status"];
          topic?: string | null;
          updated_at?: string;
          virtual?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "sessions_instructor_id_fkey";
            columns: ["instructor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sessions_playbook_id_fkey";
            columns: ["playbook_id"];
            isOneToOne: false;
            referencedRelation: "playbooks";
            referencedColumns: ["id"];
          },
        ];
      };
      strategies: {
        Row: {
          category: string | null;
          course_tags: string[];
          created_at: string | null;
          created_by: string | null;
          description: string;
          good_for: string[];
          id: string;
          published: boolean;
          session_size: Database["public"]["Enums"]["session_size"];
          slug: string;
          steps: string[];
          title: string;
          virtual_friendly: boolean;
          virtualized: boolean | null;
        };
        Insert: {
          category?: string | null;
          course_tags?: string[];
          created_at?: string | null;
          created_by?: string | null;
          description?: string;
          good_for?: string[];
          id?: string;
          published?: boolean;
          session_size?: Database["public"]["Enums"]["session_size"];
          slug?: string;
          steps: string[];
          title: string;
          virtual_friendly?: boolean;
          virtualized?: boolean | null;
        };
        Update: {
          category?: string | null;
          course_tags?: string[];
          created_at?: string | null;
          created_by?: string | null;
          description?: string;
          good_for?: string[];
          id?: string;
          published?: boolean;
          session_size?: Database["public"]["Enums"]["session_size"];
          slug?: string;
          steps?: string[];
          title?: string;
          virtual_friendly?: boolean;
          virtualized?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "strategies_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      strategy_contexts: {
        Row: {
          context: string;
          id: string;
          strategy_slug: string;
        };
        Insert: {
          context: string;
          id?: string;
          strategy_slug: string;
        };
        Update: {
          context?: string;
          id?: string;
          strategy_slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "strategy_contexts_context_fkey";
            columns: ["context"];
            isOneToOne: false;
            referencedRelation: "session_contexts";
            referencedColumns: ["context"];
          },
          {
            foreignKeyName: "strategy_contexts_strategy_slug_fkey";
            columns: ["strategy_slug"];
            isOneToOne: false;
            referencedRelation: "strategies";
            referencedColumns: ["slug"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_student_checkin: {
        Args: { session_uuid: string; student_name_input: string };
        Returns: {
          can_checkin: boolean;
          reason: string;
          session_info: Json;
        }[];
      };
      cleanup_old_data: { Args: { days_old?: number }; Returns: number };
      generate_session_code: { Args: never; Returns: string };
      get_database_stats: { Args: never; Returns: Json };
      get_session_by_code: {
        Args: { code: string };
        Returns: {
          actual_start: string;
          course_name: string;
          current_checkins: number;
          id: string;
          max_capacity: number;
          scheduled_start: string;
          si_leader_name: string;
          status: Database["public"]["Enums"]["session_status"];
          title: string;
          topic: string;
        }[];
      };
      get_session_summary: { Args: { session_uuid: string }; Returns: Json };
      get_strategies_by_contexts: {
        Args: { contexts: string[] };
        Returns: {
          category: string;
          good_for: string[];
          session_size: Database["public"]["Enums"]["session_size"];
          slug: string;
          title: string;
          virtual_friendly: boolean;
        }[];
      };
      start_session: { Args: { session_uuid: string }; Returns: boolean };
      validate_activity_definition: {
        Args: { definition: Json };
        Returns: boolean;
      };
    };
    Enums: {
      lesson_phase: "warmup" | "workout" | "closer";
      session_mode: "in-person" | "virtual" | "hybrid";
      session_size: "1+" | "2+" | "4+" | "2-4" | "4-8" | "8+";
      session_status: "scheduled" | "active" | "completed" | "canceled";
      user_role:
        | "si_leader"
        | "student"
        | "coordinator"
        | "recitation_leader"
        | "student_mentor"
        | "club_leader"
        | "study_group_organizer"
        | "ta"
        | "tutor";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      lesson_phase: ["warmup", "workout", "closer"],
      session_mode: ["in-person", "virtual", "hybrid"],
      session_size: ["1+", "2+", "4+", "2-4", "4-8", "8+"],
      session_status: ["scheduled", "active", "completed", "canceled"],
      user_role: [
        "si_leader",
        "student",
        "coordinator",
        "recitation_leader",
        "student_mentor",
        "club_leader",
        "study_group_organizer",
        "ta",
        "tutor",
      ],
    },
  },
} as const;
