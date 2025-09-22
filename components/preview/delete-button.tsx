'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner'

interface DeleteItemButtonProps {
    id: number,
    currentUser: string, 
    linkUser: string,
}

const DeleteItemButton: React.FC<DeleteItemButtonProps> = ({ id, currentUser, linkUser }) => {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleDelete = async () => {
        if (currentUser !== linkUser) {
            console.error("Apenas o proprietário pode alterar este item.");
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase
                .from('items')
                .delete()
                .eq('id', id)
                .eq('id_user', currentUser);  

            if (error) {
                throw error;
            }

            window.location.reload(); 

        } catch (error) {
            console.error('Erro ao deletar item de sua baglink:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div            
            className="w-6 h-6 flex items-center border-solid border-2 border-gray-100 dark:border-gray-700 justify-center rounded"
            aria-label="Deletar item"
            onClick={() => {                
                toast("Deletar produto?", {
                    description: "Este produto será removido de sua BagLink!",
                    closeButton: true,
                    action: {
                        label: "Deletar",
                        onClick: () => handleDelete(),
                    },
                });
            }}
        >
            <Trash2 size={16}  />
        </div>
    )
}

export default DeleteItemButton;