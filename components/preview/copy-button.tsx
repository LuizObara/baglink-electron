'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Copy } from 'lucide-react';
import { toast } from 'sonner'

interface CopyItemButtonProps {
    url: string,
    currentUserId: string, 
    username: string,
}

const CopyItemButton: React.FC<CopyItemButtonProps> = ({ currentUserId, username, url }) => {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleCopy = async () => {
        try {
            setLoading(true);
            console.log([{
                id_user: currentUserId,
                username,
                url,
                finish:false
            }])
            const { error } = await supabase
                .from('items')
                .insert([{
                    id_user: currentUserId,
                    username,
                    url,
                    finish:false
                }])

            if (error) {
                throw error;
            }

        } catch (error) {
            console.error('Erro ao copiar item:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={() => {
                handleCopy()
                toast( "Copiado para sua BagLink", {
                    description: "Este produto foi adicionado em sua BagLink!",
                    closeButton: true,
                    action: {
                        label: "Ver BagLink",
                        onClick: () => window.location.replace("/i")
                    },
                })
                
            }}
            className="w-6 h-6 flex items-center border-solid border-2 border-gray-100 dark:border-gray-700 justify-center rounded"
            aria-label="Copiar item"
            
        >
            <Copy size={16}  />
        </div>
    )
}

export default CopyItemButton;