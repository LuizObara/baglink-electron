'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createBag } from '@/lib/supabase/actions/bag';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Criando...' : 'Criar Bolsa'}
    </Button>
  );
}

export function CreateBagForm() {
  const [state, formAction] = useActionState(createBag, initialState);

  useEffect(() => {
    if (state?.message) {
      toast.error('Erro ao criar bolsa', {
        description: state.message,
      });
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Bolsa</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="Ex: Sonho de Consumo" 
          required 
          minLength={3}
        />
      </div>
      
      <SubmitButton />
    </form>
  );
}
