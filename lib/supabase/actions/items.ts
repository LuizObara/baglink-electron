import { createClient } from "../client";
import { Item } from "@/types/item";

export default async function getItemsByUsername(username: string): Promise<Item[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("username", username)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching items:", error);
        return [];
    }

    return data as Item[];
}