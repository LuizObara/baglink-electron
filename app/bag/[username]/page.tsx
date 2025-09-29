import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type BagProps = {
    params: { username: string }
}

export default async function BagPage({ params }: BagProps) {
    const { username } = await params;
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/auth/login");
    }

    const { data: profile, error} = await supabase.from("profiles").select("*").eq("id", session?.user.id).single();

    if (error) {
        console.error("Erro ao buscar perfil:", error);
        return <div>Ocorreu um erro ao carregar o perfil.</div>;
    }

    return (
        <div className="p-8">
            {username}
            <hr />
            Conteúdo de Profile: <br />
            <pre className="text-xs font-mono p-3 rounded border max-h-[400px] overflow-auto">
                {JSON.stringify(profile, null, 2)}
            </pre>

        </div>
    );
}
