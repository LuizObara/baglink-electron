import Link from 'next/link';
import { getBagsByUsername } from '@/lib/supabase/actions/bag';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { DeleteBagDialog } from '@/components/bag/delete-bag-dialog';

type UserBagsPageProps = {
    params: Promise<{
        username: string;
    }>
}

export default async function UserBagsPage({ params }: UserBagsPageProps) {
    const { username } = await params;
    const bags = await getBagsByUsername(username);

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Bolsas de <span className="text-primary">{username}</span></h1>
            </div>

            {bags.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold text-muted-foreground">Nenhuma bolsa encontrada</h2>
                    <p className="text-muted-foreground mt-2">
                        Este usuário ainda não criou nenhuma bolsa pública.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bags.map((bag) => (
                        <Card key={bag.id} className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="truncate">{bag.name}</CardTitle>
                                <CardDescription>
                                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                        /{username}/bag/{bag.slug}
                                    </span>
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto flex justify-between gap-2">
                                <Button asChild variant="secondary" className="flex-grow">
                                    <Link href={`/bag/${username}/${bag.slug}`}>
                                        Acessar Bolsa
                                    </Link>
                                </Button>
                                <DeleteBagDialog bagId={bag.id} bagName={bag.name} />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}