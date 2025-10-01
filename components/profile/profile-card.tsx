"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getProfile  } from '@/lib/supabase/actions/profile';
import ProfileCardSkeleton from "./profile-card-skeleton";
import { useEffect, useState } from 'react';
import { Profile } from '@/types/profile';
import { cn } from "@/lib/utils";

type ProfileCardProps = {
  className?: string;
};

export default function ProfileCard({ className }: ProfileCardProps) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await getProfile();
            if (data) {
                setProfile(data);
            }
            setLoading(false);
        };
        fetch();
    }, []);

    if (loading) return <ProfileCardSkeleton className={className} />;
    if (!profile) return <p>Nenhum perfil encontrado.</p>;

    return (
        <div className={cn("", className)}>
             <div className="flex items-center gap-5">
                <Avatar className="w-12 h-12">
                    <AvatarImage
                        src={profile.avatar_url || undefined}
                        className="object-cover w-full h-full rounded-full"
                    />
                    <AvatarFallback>
                        {profile.name?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                    <h4 className='font-semibold text-xl'>{profile.name || "Nome do Usuário"}</h4>
                    <h4 className='font-light text-md'>(@{profile.username || "@UserName"})</h4>
                </div>
             </div>
        </div>
    )
}