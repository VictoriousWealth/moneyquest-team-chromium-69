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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      achievement_definitions: {
        Row: {
          achievement_type: string
          created_at: string | null
          criteria: Json
          description: string
          icon: string | null
          id: string
          reward_coins: number | null
          title: string
        }
        Insert: {
          achievement_type: string
          created_at?: string | null
          criteria: Json
          description: string
          icon?: string | null
          id: string
          reward_coins?: number | null
          title: string
        }
        Update: {
          achievement_type?: string
          created_at?: string | null
          criteria?: Json
          description?: string
          icon?: string | null
          id?: string
          reward_coins?: number | null
          title?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          achievement_data: Json | null
          achievement_definition_id: string | null
          achievement_type: string
          description: string | null
          earned_at: string
          id: string
          reward_coins: number | null
          title: string | null
          user_id: string
        }
        Insert: {
          achievement_data?: Json | null
          achievement_definition_id?: string | null
          achievement_type: string
          description?: string | null
          earned_at?: string
          id?: string
          reward_coins?: number | null
          title?: string | null
          user_id: string
        }
        Update: {
          achievement_data?: Json | null
          achievement_definition_id?: string | null
          achievement_type?: string
          description?: string | null
          earned_at?: string
          id?: string
          reward_coins?: number | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_achievement_definition_id_fkey"
            columns: ["achievement_definition_id"]
            isOneToOne: false
            referencedRelation: "achievement_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_sections: {
        Row: {
          concepts: string[] | null
          created_at: string
          curriculum_order: number
          description: string
          id: number
          title: string
          updated_at: string
        }
        Insert: {
          concepts?: string[] | null
          created_at?: string
          curriculum_order: number
          description: string
          id?: number
          title: string
          updated_at?: string
        }
        Update: {
          concepts?: string[] | null
          created_at?: string
          curriculum_order?: number
          description?: string
          id?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_activities: {
        Row: {
          activity_date: string
          attempts: number
          concepts: string[] | null
          created_at: string
          id: string
          passes: number
          time_spent_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_date: string
          attempts?: number
          concepts?: string[] | null
          created_at?: string
          id?: string
          passes?: number
          time_spent_minutes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_date?: string
          attempts?: number
          concepts?: string[] | null
          created_at?: string
          id?: string
          passes?: number
          time_spent_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      game_states: {
        Row: {
          coin_multiplier: number
          coins: number
          created_at: string
          day: number
          id: string
          last_played_date: string | null
          streak_days: number
          updated_at: string
          user_id: string
          xp_multiplier: number
        }
        Insert: {
          coin_multiplier?: number
          coins?: number
          created_at?: string
          day?: number
          id?: string
          last_played_date?: string | null
          streak_days?: number
          updated_at?: string
          user_id: string
          xp_multiplier?: number
        }
        Update: {
          coin_multiplier?: number
          coins?: number
          created_at?: string
          day?: number
          id?: string
          last_played_date?: string | null
          streak_days?: number
          updated_at?: string
          user_id?: string
          xp_multiplier?: number
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          concepts: string[] | null
          created_at: string
          episode_title: string
          id: string
          result: string
          summary: string
          time_spent_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          concepts?: string[] | null
          created_at?: string
          episode_title: string
          id?: string
          result: string
          summary: string
          time_spent_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          concepts?: string[] | null
          created_at?: string
          episode_title?: string
          id?: string
          result?: string
          summary?: string
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          district: string | null
          id: string
          school: string | null
          student_id: string | null
          updated_at: string
          user_id: string
          username: string
          year: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          id?: string
          school?: string | null
          student_id?: string | null
          updated_at?: string
          user_id: string
          username: string
          year?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          id?: string
          school?: string | null
          student_id?: string | null
          updated_at?: string
          user_id?: string
          username?: string
          year?: string | null
        }
        Relationships: []
      }
      quest_responses: {
        Row: {
          correct_answer: string | null
          created_at: string
          id: string
          is_correct: boolean
          quest_id: string
          question_text: string | null
          response_time_ms: number | null
          round_number: number
          score_earned: number | null
          selected_option: string | null
          user_id: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean
          quest_id: string
          question_text?: string | null
          response_time_ms?: number | null
          round_number: number
          score_earned?: number | null
          selected_option?: string | null
          user_id: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean
          quest_id?: string
          question_text?: string | null
          response_time_ms?: number | null
          round_number?: number
          score_earned?: number | null
          selected_option?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quests: {
        Row: {
          concepts: string[] | null
          created_at: string
          curriculum_section_id: number | null
          description: string
          id: string
          npc: string
          order_in_section: number | null
          reward_coins: number
          reward_xp: number
          title: string
          zone: string
        }
        Insert: {
          concepts?: string[] | null
          created_at?: string
          curriculum_section_id?: number | null
          description: string
          id?: string
          npc: string
          order_in_section?: number | null
          reward_coins?: number
          reward_xp?: number
          title: string
          zone: string
        }
        Update: {
          concepts?: string[] | null
          created_at?: string
          curriculum_section_id?: number | null
          description?: string
          id?: string
          npc?: string
          order_in_section?: number | null
          reward_coins?: number
          reward_xp?: number
          title?: string
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "quests_curriculum_section_id_fkey"
            columns: ["curriculum_section_id"]
            isOneToOne: false
            referencedRelation: "curriculum_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          best_count: number
          created_at: string
          current_count: number
          id: string
          last_activity_date: string | null
          streak_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          best_count?: number
          created_at?: string
          current_count?: number
          id?: string
          last_activity_date?: string | null
          streak_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          best_count?: number
          created_at?: string
          current_count?: number
          id?: string
          last_activity_date?: string | null
          streak_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          active_days: number
          class_rank: number | null
          created_at: string
          episodes_passed: number
          id: string
          money_saved: number
          time_spent_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          active_days?: number
          class_rank?: number | null
          created_at?: string
          episodes_passed?: number
          id?: string
          money_saved?: number
          time_spent_minutes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          active_days?: number
          class_rank?: number | null
          created_at?: string
          episodes_passed?: number
          id?: string
          money_saved?: number
          time_spent_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          item_category: string | null
          item_name: string | null
          item_quality: string | null
          item_value: number | null
          quest_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          item_category?: string | null
          item_name?: string | null
          item_quality?: string | null
          item_value?: number | null
          quest_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          item_category?: string | null
          item_name?: string | null
          item_quality?: string | null
          item_value?: number | null
          quest_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quest_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          quest_id: string
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          quest_id: string
          started_at?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          quest_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_demo_activities_for_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
