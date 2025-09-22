'use client';

import { useEffect, useState } from 'react';
import FinishToggle from './finish-toggle';
import DeleteItemButton from './delete-button';
import CopyItemButton from './copy-button';
import ItemSkeleton from './item-skeleton';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { fetchLinkPreview } from '@/services/linkPreviewService';
import { Item } from '@/interfaces/Item';
import { PreviewData } from '@/interfaces/PreviewData';


const LinkPreviewRow = ({ items, username, currentUser, linkUser }: { items: Item[]; currentUser: string; linkUser: string; username: string; }) => {
    const [previewData, setPreviewData] = useState<PreviewData[]>([]);
    const [loading, setLoading] = useState(true);
    const [itemStates, setItemStates] = useState(items.map(item => item.finish));

    useEffect(() => {
        const fetchAllPreviews = async () => {
            const previews = await Promise.all(items.map(item => fetchLinkPreview(item.url)));
            setPreviewData(previews);
            setLoading(false);
        };
        fetchAllPreviews();
    }, [items]);

    if (loading) { 
        return (
            <div className="flex flex-col space-y-4 mt-3 mx-3">
                {items.map((_, index) => (
                    <div key={index} className="flex">
                        <ItemSkeleton/>
                    </div>
                ))}
            </div>
        );
    }

    const handleFinishToggle = (index: any) => {
        const updatedFinish = !itemStates[index];
        const newStates = [...itemStates];
        newStates[index] = updatedFinish;
        setItemStates(newStates);
    };

    return (
        <div className="flex flex-col space-y-4 mt-3 mx-3">
            {previewData.map((preview, index) => (
                <div key={items[index].id} className="flex">
                    <div className="flex items-center mx-3">
                        {currentUser === linkUser && (
                            <FinishToggle 
                                id={items[index].id} 
                                currentUser={currentUser} 
                                linkUser={linkUser} 
                                initialFinish={items[index].finish} 
                                onToggle={() => handleFinishToggle(index)}
                            />
                        )}
                    </div>

                    <div className={`flex p-4 border border-gray-300 rounded-lg shadow-lg w-full ${itemStates[index] ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <div className="flex items-center space-x-4">
                            <img src={preview.image} className="max-w-32 object-cover" />
                        </div>
                        <div className="flex-1 ml-4">
                            <h3 className="text-lg font-semibold">{preview.title}</h3>
                            <h2 className="text-xl text-green-600 font-bold">
                                {isNaN(Number(preview.price.replace(/\./g, '').replace(',', '.')))
                                    ? preview.price
                                    : `R$ ${Number(preview.price.replace(/\./g, '').replace(',', '.')).toFixed(2).replace('.', ',')}`}
                            </h2>
                            <h6 className="text-sm text-gray-500">{preview.site}</h6>
                            <a href={preview.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                                {preview.url}
                            </a>
                        </div>
                        <div className="flex items-start mx-3">
                            {currentUser === linkUser && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <DeleteItemButton 
                                                id={items[index].id}
                                                currentUser={currentUser} 
                                                linkUser={linkUser}                                               
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Deletar produto</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                            {currentUser !== linkUser && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <CopyItemButton 
                                                url={preview.url}
                                                currentUserId={currentUser} 
                                                username={username}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Copiar produto para sua Baglink</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LinkPreviewRow;