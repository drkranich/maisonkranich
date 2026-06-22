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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          district: string | null
          id: string
          is_default: boolean
          label: string | null
          line1: string
          line2: string | null
          phone: string | null
          recipient: string
          state: string | null
          user_id: string
          zip: string | null
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          district?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          line1: string
          line2?: string | null
          phone?: string | null
          recipient: string
          state?: string | null
          user_id: string
          zip?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          district?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          line1?: string
          line2?: string | null
          phone?: string | null
          recipient?: string
          state?: string | null
          user_id?: string
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json | null
          entity: string | null
          entity_id: string | null
          id: string
          ip_address: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
          ip_address?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
          ip_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          body: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          active: boolean
          cover_url: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          name: string
          slug: string
          sort_order: number
          story: string | null
          theme: string | null
        }
        Insert: {
          active?: boolean
          cover_url?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          name: string
          slug: string
          sort_order?: number
          story?: string | null
          theme?: string | null
        }
        Update: {
          active?: boolean
          cover_url?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          story?: string | null
          theme?: string | null
        }
        Relationships: []
      }
      composition_items: {
        Row: {
          composition_id: string
          created_at: string
          customization: Json | null
          id: string
          kind: Database["public"]["Enums"]["product_kind"]
          name: string
          position: number
          product_id: string | null
          quantity: number
          unit_price_cents: number
        }
        Insert: {
          composition_id: string
          created_at?: string
          customization?: Json | null
          id?: string
          kind: Database["public"]["Enums"]["product_kind"]
          name: string
          position?: number
          product_id?: string | null
          quantity?: number
          unit_price_cents?: number
        }
        Update: {
          composition_id?: string
          created_at?: string
          customization?: Json | null
          id?: string
          kind?: Database["public"]["Enums"]["product_kind"]
          name?: string
          position?: number
          product_id?: string | null
          quantity?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "composition_items_composition_id_fkey"
            columns: ["composition_id"]
            isOneToOne: false
            referencedRelation: "compositions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "composition_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      compositions: {
        Row: {
          created_at: string
          id: string
          message: string | null
          name: string | null
          preview: Json
          status: Database["public"]["Enums"]["composition_status"]
          total_cents: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          name?: string | null
          preview?: Json
          status?: Database["public"]["Enums"]["composition_status"]
          total_cents?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          name?: string | null
          preview?: Json
          status?: Database["public"]["Enums"]["composition_status"]
          total_cents?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compositions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          assignee_id: string | null
          created_at: string
          customer_id: string | null
          id: string
          last_message_at: string | null
          order_id: string | null
          status: Database["public"]["Enums"]["conversation_status"]
          subject: string | null
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          last_message_at?: string | null
          order_id?: string | null
          status?: Database["public"]["Enums"]["conversation_status"]
          subject?: string | null
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          last_message_at?: string | null
          order_id?: string | null
          status?: Database["public"]["Enums"]["conversation_status"]
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          created_at: string
          id: string
          order_id: string | null
          user_id: string | null
        }
        Insert: {
          coupon_id: string
          created_at?: string
          id?: string
          order_id?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_id?: string
          created_at?: string
          id?: string
          order_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string | null
          ends_at: string | null
          first_purchase_only: boolean
          id: string
          kind: Database["public"]["Enums"]["coupon_kind"]
          max_uses: number | null
          metadata: Json | null
          min_order_cents: number | null
          percent: number | null
          starts_at: string | null
          used_count: number
          value_cents: number | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string | null
          ends_at?: string | null
          first_purchase_only?: boolean
          id?: string
          kind: Database["public"]["Enums"]["coupon_kind"]
          max_uses?: number | null
          metadata?: Json | null
          min_order_cents?: number | null
          percent?: number | null
          starts_at?: string | null
          used_count?: number
          value_cents?: number | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string | null
          ends_at?: string | null
          first_purchase_only?: boolean
          id?: string
          kind?: Database["public"]["Enums"]["coupon_kind"]
          max_uses?: number | null
          metadata?: Json | null
          min_order_cents?: number | null
          percent?: number | null
          starts_at?: string | null
          used_count?: number
          value_cents?: number | null
        }
        Relationships: []
      }
      curation_rules: {
        Row: {
          actions: Json
          active: boolean
          conditions: Json
          created_at: string
          id: string
          name: string
          priority: number
          seasonal: boolean
        }
        Insert: {
          actions?: Json
          active?: boolean
          conditions?: Json
          created_at?: string
          id?: string
          name: string
          priority?: number
          seasonal?: boolean
        }
        Update: {
          actions?: Json
          active?: boolean
          conditions?: Json
          created_at?: string
          id?: string
          name?: string
          priority?: number
          seasonal?: boolean
        }
        Relationships: []
      }
      curation_sessions: {
        Row: {
          answers: Json
          composition_id: string | null
          created_at: string
          id: string
          recommendation: Json | null
          status: Database["public"]["Enums"]["curation_status"]
          user_id: string | null
        }
        Insert: {
          answers?: Json
          composition_id?: string | null
          created_at?: string
          id?: string
          recommendation?: Json | null
          status?: Database["public"]["Enums"]["curation_status"]
          user_id?: string | null
        }
        Update: {
          answers?: Json
          composition_id?: string | null
          created_at?: string
          id?: string
          recommendation?: Json | null
          status?: Database["public"]["Enums"]["curation_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curation_sessions_composition_id_fkey"
            columns: ["composition_id"]
            isOneToOne: false
            referencedRelation: "compositions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curation_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          amount_cents: number | null
          created_at: string
          currency: string | null
          due_by: string | null
          evidence: Json
          id: string
          order_id: string | null
          reason: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          stripe_dispute_id: string | null
          updated_at: string
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          due_by?: string | null
          evidence?: Json
          id?: string
          order_id?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          stripe_dispute_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          due_by?: string | null
          evidence?: Json
          id?: string
          order_id?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          stripe_dispute_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string
          id: string
          kind: string | null
          mime_type: string | null
          name: string
          order_id: string | null
          size_bytes: number | null
          storage_path: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string | null
          mime_type?: string | null
          name: string
          order_id?: string | null
          size_bytes?: number | null
          storage_path: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string | null
          mime_type?: string | null
          name?: string
          order_id?: string | null
          size_bytes?: number | null
          storage_path?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json
          body: string | null
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string | null
        }
        Insert: {
          attachments?: Json
          body?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string | null
        }
        Update: {
          attachments?: Json
          body?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          composition_id: string | null
          id: string
          kind: Database["public"]["Enums"]["product_kind"] | null
          metadata: Json | null
          name: string
          order_id: string
          product_id: string | null
          quantity: number
          total_cents: number
          unit_price_cents: number
        }
        Insert: {
          composition_id?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["product_kind"] | null
          metadata?: Json | null
          name: string
          order_id: string
          product_id?: string | null
          quantity?: number
          total_cents?: number
          unit_price_cents?: number
        }
        Update: {
          composition_id?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["product_kind"] | null
          metadata?: Json | null
          name?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          total_cents?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_composition_id_fkey"
            columns: ["composition_id"]
            isOneToOne: false
            referencedRelation: "compositions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          note: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_id: string | null
          created_at: string
          currency: string
          discount_cents: number
          id: string
          notes: string | null
          number: number
          payment: Json | null
          shipping_address: Json | null
          shipping_cents: number
          status: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent: string | null
          subtotal_cents: number
          tax_cents: number
          total_cents: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string
          currency?: string
          discount_cents?: number
          id?: string
          notes?: string | null
          number?: number
          payment?: Json | null
          shipping_address?: Json | null
          shipping_cents?: number
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent?: string | null
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          coupon_id?: string | null
          created_at?: string
          currency?: string
          discount_cents?: number
          id?: string
          notes?: string | null
          number?: number
          payment?: Json | null
          shipping_address?: Json | null
          shipping_cents?: number
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent?: string | null
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_coupon"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: Json
          created_at: string
          id: string
          seo: Json | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          seo?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          seo?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      personalizations: {
        Row: {
          created_at: string
          files: Json
          id: string
          notes: string | null
          order_id: string | null
          status: Database["public"]["Enums"]["personalization_status"]
          type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          files?: Json
          id?: string
          notes?: string | null
          order_id?: string | null
          status?: Database["public"]["Enums"]["personalization_status"]
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          files?: Json
          id?: string
          notes?: string | null
          order_id?: string | null
          status?: Database["public"]["Enums"]["personalization_status"]
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personalizations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personalizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_collections: {
        Row: {
          collection_id: string
          product_id: string
        }
        Insert: {
          collection_id: string
          product_id: string
        }
        Update: {
          collection_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          attributes: Json
          category_id: string | null
          created_at: string
          currency: string
          description: string | null
          featured: boolean
          id: string
          images: Json
          kind: Database["public"]["Enums"]["product_kind"]
          name: string
          price_cents: number
          short_desc: string | null
          sku: string | null
          slug: string
          stock: number
          track_stock: boolean
          updated_at: string
        }
        Insert: {
          active?: boolean
          attributes?: Json
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          featured?: boolean
          id?: string
          images?: Json
          kind?: Database["public"]["Enums"]["product_kind"]
          name: string
          price_cents?: number
          short_desc?: string | null
          sku?: string | null
          slug: string
          stock?: number
          track_stock?: boolean
          updated_at?: string
        }
        Update: {
          active?: boolean
          attributes?: Json
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          featured?: boolean
          id?: string
          images?: Json
          kind?: Database["public"]["Enums"]["product_kind"]
          name?: string
          price_cents?: number
          short_desc?: string | null
          sku?: string | null
          slug?: string
          stock?: number
          track_stock?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          locale: string | null
          marketing_opt_in: boolean | null
          phone: string | null
          preferences: Json | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          locale?: string | null
          marketing_opt_in?: boolean | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          locale?: string | null
          marketing_opt_in?: boolean | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string | null
          id: string
          kind: Database["public"]["Enums"]["refund_kind"]
          order_id: string | null
          reason: string | null
          status: Database["public"]["Enums"]["refund_status"]
          stripe_refund_id: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["refund_kind"]
          order_id?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["refund_status"]
          stripe_refund_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["refund_kind"]
          order_id?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["refund_status"]
          stripe_refund_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          description: string | null
          features: Json
          highlight: boolean
          id: string
          interval: Database["public"]["Enums"]["plan_interval"]
          name: string
          price_cents: number
          slug: string
          sort_order: number
          stripe_price_id: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          description?: string | null
          features?: Json
          highlight?: boolean
          id?: string
          interval: Database["public"]["Enums"]["plan_interval"]
          name: string
          price_cents: number
          slug: string
          sort_order?: number
          stripe_price_id?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          description?: string | null
          features?: Json
          highlight?: boolean
          id?: string
          interval?: Database["public"]["Enums"]["plan_interval"]
          name?: string
          price_cents?: number
          slug?: string
          sort_order?: number
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          id: string
          plan_id: string | null
          started_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["wallet_txn_kind"]
          reason: string | null
          reference: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["wallet_txn_kind"]
          reason?: string | null
          reference?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["wallet_txn_kind"]
          reason?: string | null
          reference?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance_cents: number
          currency: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_cents?: number
          currency?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_cents?: number
          currency?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          created_at: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_staff: { Args: { uid?: string }; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "admin" | "curator" | "support" | "customer"
      composition_status: "draft" | "saved" | "ordered" | "archived"
      content_status: "draft" | "published" | "archived"
      conversation_status: "open" | "pending" | "closed"
      coupon_kind: "percent" | "fixed" | "free_shipping"
      curation_status: "in_progress" | "suggested" | "accepted" | "dismissed"
      dispute_status:
        | "needs_response"
        | "under_review"
        | "won"
        | "lost"
        | "warning_closed"
      notification_type:
        | "order"
        | "payment"
        | "subscription"
        | "message"
        | "file"
        | "shipping"
        | "system"
        | "curation"
      order_status:
        | "received"
        | "paid"
        | "in_production"
        | "personalizing"
        | "assembling"
        | "packed"
        | "dispatched"
        | "in_transit"
        | "delivered"
        | "completed"
        | "cancelled"
        | "refunded"
      personalization_status: "pending" | "in_review" | "approved" | "rejected"
      plan_interval: "monthly" | "quarterly" | "semiannual" | "annual"
      product_kind:
        | "box"
        | "filling"
        | "ribbon"
        | "tag"
        | "card"
        | "adornment"
        | "gift"
      refund_kind: "full" | "partial"
      refund_status:
        | "requested"
        | "reviewing"
        | "approved"
        | "rejected"
        | "processed"
      subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "paused"
        | "cancelled"
      wallet_txn_kind: "credit" | "debit"
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
      app_role: ["owner", "admin", "curator", "support", "customer"],
      composition_status: ["draft", "saved", "ordered", "archived"],
      content_status: ["draft", "published", "archived"],
      conversation_status: ["open", "pending", "closed"],
      coupon_kind: ["percent", "fixed", "free_shipping"],
      curation_status: ["in_progress", "suggested", "accepted", "dismissed"],
      dispute_status: [
        "needs_response",
        "under_review",
        "won",
        "lost",
        "warning_closed",
      ],
      notification_type: [
        "order",
        "payment",
        "subscription",
        "message",
        "file",
        "shipping",
        "system",
        "curation",
      ],
      order_status: [
        "received",
        "paid",
        "in_production",
        "personalizing",
        "assembling",
        "packed",
        "dispatched",
        "in_transit",
        "delivered",
        "completed",
        "cancelled",
        "refunded",
      ],
      personalization_status: ["pending", "in_review", "approved", "rejected"],
      plan_interval: ["monthly", "quarterly", "semiannual", "annual"],
      product_kind: [
        "box",
        "filling",
        "ribbon",
        "tag",
        "card",
        "adornment",
        "gift",
      ],
      refund_kind: ["full", "partial"],
      refund_status: [
        "requested",
        "reviewing",
        "approved",
        "rejected",
        "processed",
      ],
      subscription_status: [
        "trialing",
        "active",
        "past_due",
        "paused",
        "cancelled",
      ],
      wallet_txn_kind: ["credit", "debit"],
    },
  },
} as const
