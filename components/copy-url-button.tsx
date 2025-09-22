'use client'

import { Link } from 'lucide-react';
import { toast } from "sonner";

interface CopyUrlButtonProps {
    userId: string,  
    OwnerBagId: string,  
    nameUser?: string
}

export default function CopyUrlButton({ userId, OwnerBagId, nameUser}: CopyUrlButtonProps) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href) 
            .then(() => {
                const message = userId === OwnerBagId 
                    ? 'Sua Baglink foi encaminhada para área de transferência!' 
                    : `A Baglink de ${nameUser} foi encaminhada para área de transferência!`;
                
                toast(message, {
                    description: 'URL copiada com sucesso!',
                });
            })
            .catch(err => {
                console.error('Falha ao copiar: ', err);
            });
    }

    return (
        <div
            className="w-8 h-8 flex items-center justify-center border-2 rounded-full"                
            onClick={copyToClipboard}                
        >
            <Link size={16} />
        </div>
    );
}