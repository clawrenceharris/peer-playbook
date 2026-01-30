export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bug_reports: {
        Row: {
          created_at: string | null
          error_code: string
          error_message: string
          id: string
          metadata: Json | null
          status: string | null
          steps_to_reproduce: string | null
          technical_details: Json | null
          url: string | null
          user_agent: string | null
          user_description: string | null
          user_id: string | null
          user_message: string | null
        }
        Insert: {
          created_at?: string | null
          error_code: string
          error_message: string
          id?: string
          metadata?: Json | null
          status?: string | null
          steps_to_reproduce?: string | null
          technical_details?: Json | null
          url?: string | null
          user_agent?: string | null
          user_description?: string | null
          user_id?: string | null
          user_message?: string | null
        }
        Update: {
          created_at?: string | null
          error_code?: string
          error_message?: string
          id?: string
          metadata?: Json | null
          status?: string | null
          steps_to_reproduce?: string | null
          technical_details?: Json | null
          url?: string | null
          user_agent?: string | null
          user_description?: string | null
          user_id?: string | null
          user_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bug_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_playbooks: {
        Row: {
          id: string
          playbook_id: string
          user_id: string
        }
        Insert: {
          id?: string
          playbook_id: string
          user_id: string
        }
        Update: {
          id?: string
          playbook_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_playbooks_playbook_id_fkey"
            columns: ["playbook_id"]
            isOneToOne: false
            referencedRelation: "playbooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_playbooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      playbook_strategies: {
        Row: {
          created_at: string | null
          custom_steps: string[] | null
          custom_title: string | null
          description: string
          id: string
          phase: Database["public"]["Enums"]["lesson_phase"]
          playbook_id: string
          position: number
          source_id: string
          source_type: Database["public"]["Enums"]["strategy_source_type"]
          steps: string[]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          custom_steps?: string[] | null
          custom_title?: string | null
          description?: string
          id?: string
          phase: Database["public"]["Enums"]["lesson_phase"]
          playbook_id: string
          position?: number
          source_id: string
          source_type: Database["public"]["Enums"]["strategy_source_type"]
          steps: string[]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          custom_steps?: string[] | null
          custom_title?: string | null
          description?: string
          id?: string
          phase?: Database["public"]["Enums"]["lesson_phase"]
          playbook_id?: string
          position?: number
          source_id?: string
          source_type?: Database["public"]["Enums"]["strategy_source_type"]
          steps?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_cards_lesson_id_fkey"
            columns: ["playbook_id"]
            isOneToOne: false
            referencedRelation: "playbooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playbook_strategies_base_strategy_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      playbooks: {
        Row: {
          course_name: string
          created_at: string
          created_by: string
          favorite: boolean | null
          id: string
          is_published: boolean | null
          modes: Database["public"]["Enums"]["session_mode"][]
          subject: Database["public"]["Enums"]["course_subject"]
          topic: string
          updated_at: string | null
        }
        Insert: {
          course_name: string
          created_at?: string
          created_by?: string
          favorite?: boolean | null
          id?: string
          is_published?: boolean | null
          modes?: Database["public"]["Enums"]["session_mode"][]
          subject: Database["public"]["Enums"]["course_subject"]
          topic: string
          updated_at?: string | null
        }
        Update: {
          course_name?: string
          created_at?: string
          created_by?: string
          favorite?: boolean | null
          id?: string
          is_published?: boolean | null
          modes?: Database["public"]["Enums"]["session_mode"][]
          subject?: Database["public"]["Enums"]["course_subject"]
          topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playbooks_owner_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          courses_instructed: string[] | null
          created_at: string | null
          first_name: string
          id: string
          last_name: string | null
          onboarding_completed: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          courses_instructed?: string[] | null
          created_at?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          courses_instructed?: string[] | null
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_strategies: {
        Row: {
          id: string
          strategy_id: string
          user_id: string
        }
        Insert: {
          id?: string
          strategy_id: string
          user_id: string
        }
        Update: {
          id?: string
          strategy_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_strategies_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_strategies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_contexts: {
        Row: {
          created_at: string
          id: string
          key: string
          label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          label: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          call_id: string | null
          course_name: string
          created_at: string
          description: string | null
          id: string
          leader_id: string
          mode: Database["public"]["Enums"]["session_mode"] | null
          playbook_id: string | null
          scheduled_start: string
          session_code: string | null
          status: Database["public"]["Enums"]["session_status"]
          subject: Database["public"]["Enums"]["course_subject"]
          topic: string
          updated_at: string
        }
        Insert: {
          call_id?: string | null
          course_name: string
          created_at?: string
          description?: string | null
          id?: string
          leader_id?: string
          mode?: Database["public"]["Enums"]["session_mode"] | null
          playbook_id?: string | null
          scheduled_start?: string
          session_code?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          subject: Database["public"]["Enums"]["course_subject"]
          topic?: string
          updated_at?: string
        }
        Update: {
          call_id?: string | null
          course_name?: string
          created_at?: string
          description?: string | null
          id?: string
          leader_id?: string
          mode?: Database["public"]["Enums"]["session_mode"] | null
          playbook_id?: string | null
          scheduled_start?: string
          session_code?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          subject?: Database["public"]["Enums"]["course_subject"]
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_playbook_id_fkey"
            columns: ["playbook_id"]
            isOneToOne: false
            referencedRelation: "playbooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      strategies: {
        Row: {
          course_tags: string[]
          created_at: string | null
          created_by: string | null
          description: string
          good_for: string[]
          id: string
          is_published: boolean | null
          is_system: boolean | null
          published_at: string | null
          session_size: Database["public"]["Enums"]["session_size"]
          slug: string
          steps: string[]
          title: string
          virtual_friendly: boolean
          virtualized: boolean | null
        }
        Insert: {
          course_tags?: string[]
          created_at?: string | null
          created_by?: string | null
          description?: string
          good_for?: string[]
          id?: string
          is_published?: boolean | null
          is_system?: boolean | null
          published_at?: string | null
          session_size?: Database["public"]["Enums"]["session_size"]
          slug?: string
          steps: string[]
          title: string
          virtual_friendly?: boolean
          virtualized?: boolean | null
        }
        Update: {
          course_tags?: string[]
          created_at?: string | null
          created_by?: string | null
          description?: string
          good_for?: string[]
          id?: string
          is_published?: boolean | null
          is_system?: boolean | null
          published_at?: string | null
          session_size?: Database["public"]["Enums"]["session_size"]
          slug?: string
          steps?: string[]
          title?: string
          virtual_friendly?: boolean
          virtualized?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "strategies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_contexts: {
        Row: {
          context_key: string
          id: string
          strategy_id: string
        }
        Insert: {
          context_key: string
          id?: string
          strategy_id: string
        }
        Update: {
          context_key?: string
          id?: string
          strategy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_contexts_context_key_fkey"
            columns: ["context_key"]
            isOneToOne: false
            referencedRelation: "session_contexts"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "strategy_contexts_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_strategies: {
        Row: {
          base_strategy_id: string | null
          created_at: string
          id: string
          metadata: Json
          owner_id: string
          source_type: string
          steps: string[]
          title: string
          updated_at: string
        }
        Insert: {
          base_strategy_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          owner_id: string
          source_type: string
          steps?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          base_strategy_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          owner_id?: string
          source_type?: string
          steps?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_strategies_base_strategy_id_fkey"
            columns: ["base_strategy_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_student_checkin: {
        Args: { session_uuid: string; student_name_input: string }
        Returns: {
          can_checkin: boolean
          reason: string
          session_info: Json
        }[]
      }
      cleanup_old_data: { Args: { days_old?: number }; Returns: number }
      generate_session_code: { Args: never; Returns: string }
      get_database_stats: { Args: never; Returns: Json }
      get_session_by_code: {
        Args: { code: string }
        Returns: {
          actual_start: string
          course_name: string
          current_checkins: number
          id: string
          max_capacity: number
          scheduled_start: string
          si_leader_name: string
          status: Database["public"]["Enums"]["session_status"]
          title: string
          topic: string
        }[]
      }
      get_session_summary: { Args: { session_uuid: string }; Returns: Json }
      get_strategies_by_context: {
        Args: { contexts: string[]; max_results?: number; min_results?: number }
        Returns: {
          good_for: Json
          id: string
          match_count: number
          session_size: string
          slug: string
          title: string
          virtual_friendly: boolean
        }[]
      }
      start_session: { Args: { session_uuid: string }; Returns: boolean }
      validate_activity_definition: {
        Args: { definition: Json }
        Returns: boolean
      }
    }
    Enums: {
      course_subject:
        | "Biology"
        | "Chemistry"
        | "Coding"
        | "Cybersecurity"
        | "Geography"
        | "Math"
        | "Physics"
        | "Science"
        | "Other"
      lesson_phase: "warmup" | "workout" | "closer"
      session_mode: "in-person" | "virtual" | "hybrid"
      session_size: "1+" | "2+" | "4+" | "2-4" | "4-8" | "8+"
      session_status: "scheduled" | "active" | "completed" | "canceled"
      status: "active" | "scheduled" | "completed" | "canceled"
      strategy_source_type: "system" | "user" | "playbook"
      user_role: "si_leader" | "student" | "coordinator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      course_subject: [
        "Biology",
        "Chemistry",
        "Coding",
        "Cybersecurity",
        "Geography",
        "Math",
        "Physics",
        "Science",
        "Other",
      ],
      lesson_phase: ["warmup", "workout", "closer"],
      session_mode: ["in-person", "virtual", "hybrid"],
      session_size: ["1+", "2+", "4+", "2-4", "4-8", "8+"],
      session_status: ["scheduled", "active", "completed", "canceled"],
      status: ["active", "scheduled", "completed", "canceled"],
      strategy_source_type: ["system", "user", "playbook"],
      user_role: ["si_leader", "student", "coordinator"],
    },
  },
} as const
