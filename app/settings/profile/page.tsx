import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Profile } from "@/types/profile";

export default async function ProfileSettingsPage() {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/auth/login");
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

    if (error || !data) {
        console.error("Erro ao buscar perfil:", error);
        return <div>Ocorreu um erro ao carregar o perfil.</div>;
    }
    
    const profile: Profile = data;

    return (
        <>
            <h3 className="text-2xl font-bold">Edite seu Perfil</h3>
            <pre className="text-xs font-mono p-3 mt-2 rounded border bg-slate-100 dark:bg-slate-800 max-h-[400px] overflow-auto">
                {JSON.stringify(profile, null, 2)}
            </pre>
            {/* TODO: formulário para edição do perfil */}
        </>
    );
}
