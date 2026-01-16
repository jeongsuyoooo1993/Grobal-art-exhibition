export interface Database {
  public: {
    Tables: {
      museums: {
        Row: {
          id: number;
          country: string;
          city: string;
          name: string;
          short_name: string;
          description: string;
          image: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          country: string;
          city: string;
          name: string;
          short_name: string;
          description: string;
          image: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          country?: string;
          city?: string;
          name?: string;
          short_name?: string;
          description?: string;
          image?: string;
          updated_at?: string;
        };
      };
      exhibitions: {
        Row: {
          id: number;
          museum_id: number;
          title: string;
          category: string;
          year: string;
          description: string;
          image: string;
          website: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          museum_id: number;
          title: string;
          category: string;
          year: string;
          description: string;
          image: string;
          website: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          museum_id?: number;
          title?: string;
          category?: string;
          year?: string;
          description?: string;
          image?: string;
          website?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Convenience types
export type Museum = Database['public']['Tables']['museums']['Row'];
export type MuseumInsert = Database['public']['Tables']['museums']['Insert'];
export type MuseumUpdate = Database['public']['Tables']['museums']['Update'];

export type Exhibition = Database['public']['Tables']['exhibitions']['Row'];
export type ExhibitionInsert = Database['public']['Tables']['exhibitions']['Insert'];
export type ExhibitionUpdate = Database['public']['Tables']['exhibitions']['Update'];

// Combined type for frontend use (museum with exhibitions)
export interface MuseumWithExhibitions extends Museum {
  exhibitions: Exhibition[];
}
