import { createClient } from '@supabase/supabase-js';

// Use Vite env vars. These are provided at build/dev time from `import.meta.env`.
// Keep them typed as `string | undefined` so we can provide a safe fallback.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabaseClient: any;

if (supabaseUrl && supabaseAnonKey) {
  // Create the real client when the env vars are present.
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Provide a minimal stub so importing modules won't crash when env vars
  // are missing (useful for local dev without a configured .env).
  supabaseClient = {
    auth: {
      async getSession() {
        return { data: { session: null } };
      },
      onAuthStateChange(_cb: any) {
        return { data: { subscription: { unsubscribe() {} } } };
      },
      async signOut() {
        return { error: null };
      },
      async signInWithPassword(..._args: any[]) {
        return { data: null, error: new Error('Supabase not configured') };
      },
      async getUser() {
        return { data: { user: null } };
      },
      async resetPasswordForEmail(..._args: any[]) {
        return { error: new Error('Supabase not configured') };
      },
      async updateUser(..._args: any[]) {
        return { error: new Error('Supabase not configured') };
      },
    },
    from: (_table?: string) => {
      return {
        select: (_cols?: string) => ({
          eq: (_col: string, _val: any) => ({
            maybeSingle: async () => ({ data: null }),
          }),
          maybeSingle: async () => ({ data: null }),
        }),
        insert: async (..._args: any[]) => ({ error: new Error('Supabase not configured') }),
        delete: async (..._args: any[]) => ({ error: new Error('Supabase not configured') }),
      };
    },
  } as any;
}

export const supabase = supabaseClient as ReturnType<typeof createClient> | any;

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  blood_group: string;
  location: string;
  created_at: string;
};

export type Donor = {
  id: string;
  user_id: string;
  availability: boolean;
  last_donation_date: string | null;
  created_at: string;
  updated_at: string;
};

export type DonorWithUser = Donor & {
  users: User;
};
