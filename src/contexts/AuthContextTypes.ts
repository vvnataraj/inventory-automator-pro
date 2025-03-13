
import { Session, User } from "@supabase/supabase-js";

// Add TypeScript extensions to the User type to include the profile fields
declare module '@supabase/supabase-js' {
  interface User {
    username?: string | null;
    avatar_url?: string | null;
  }
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkPasswordStrength: (password: string) => {
    isStrong: boolean;
    errors: string[];
  };
  needsPasswordChange: boolean;
  setNeedsPasswordChange: (value: boolean) => void;
}
