'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { addItemToBag } from '@/lib/supabase/actions/item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type FormState = {
    error?: string;
    success?: string;
};

const initialState: FormState = {};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="icon" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </Button>
    );
}

export function AddItemForm({ bagId }: { bagId: string }) {
    const router = useRouter();
    const [state, formAction] = useActionState(addItemToBag, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.error) {
            toast.error("Erro", { description: state.error });
        }
        if (state?.success) {
            toast.success("Sucesso", { description: state.success });
            formRef.current?.reset();
            router.refresh();
        }
    }, [state, router]);

    return (
        <form ref={formRef} action={formAction} className="flex items-center gap-2">
            <Input
                name="url"
                type="url"
                placeholder="https://loja.com.br/produto..."
                required
                className="flex-grow"
            />
            <input type="hidden" name="bagId" value={bagId} />
            <SubmitButton />
        </form>
    );
}
