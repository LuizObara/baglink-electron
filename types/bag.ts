import { Profile } from "./profile"; 

export type Bag = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile; 
};