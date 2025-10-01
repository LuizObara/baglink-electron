'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getProfile, updateProfile, uploadAvatar, deleteAvatar, uploadBanner } from '@/lib/supabase/actions/profile';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ProfileFormSkeleton from "./profile-form-skeleton";
import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Profile } from '@/types/profile';
import { Pencil } from "lucide-react";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from "../ui/label";
import { toast } from "sonner";
// import Image from "next/image";
import Link from "next/link";

export default function ProfileForm() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [formState, setFormState] = useState({
        name: '',
        username: '',
    });
    const [initialFormState, setInitialFormState] = useState(formState);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    // const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await getProfile();
            if (data) {
                setProfile(data);
                const initial = {
                    name: data.name ?? '',
                    username: data.username ?? '',
                };
                setFormState(initial);
                setInitialFormState(initial);
            }
            setLoading(false);
        };
        fetch();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let avatarUrl = profile?.avatar_url;
            let bannerUrl = profile?.banner_url;

            if (avatarFile) {
                avatarUrl = await uploadAvatar(avatarFile);
            }
            if (bannerFile) {
                bannerUrl = await uploadBanner(bannerFile);
            }

            await updateProfile({
                ...formState,
                avatar_url: avatarUrl,
                banner_url: bannerUrl,
            });

            setProfile((prev) =>
                prev ? { ...prev, ...formState, avatar_url: avatarUrl ?? null, banner_url: bannerUrl ?? null } : null
            );
            setInitialFormState(formState);
            setAvatarFile(null);
            setBannerFile(null);
            setPreview(null);
            toast.success("Perfil atualizado com sucesso!");
        } catch (error) {
            toast.error("Erro ao atualizar o perfil.");
        }
    };

    const hasChanges =
        formState.name !== initialFormState.name ||
        formState.username !== initialFormState.username ||
        avatarFile !== null ||
        bannerFile !== null;

    if (loading) return <ProfileFormSkeleton />;
    if (!profile) return <p>Nenhum perfil encontrado.</p>;

    return (
        <>
            <div className="flex justify-end">
                <Link href={`/profile/${profile.username}`}>
                    <Button variant="secondary">
                        Visitar Perfil
                    </Button>
                </Link>
            </div>
            <h4 className="text-2xl font-semibold my-3 border-b w-full">Editar perfil</h4>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-3">
                    <div className="col-span-2 px-4">
                        <div className="flex flex-col gap-4 mt-3">
                            <Label> E-mail </Label>
                            <Input
                                type='text'
                                disabled
                                value={profile.email}
                            />
                            <Label> Username </Label>
                            <Input
                                name="username"
                                type='text'
                                value={formState.username}
                                onChange={handleChange}
                                placeholder='username'
                            />
                            <Label> Nome </Label>
                            <Input
                                name="name"
                                type='text'
                                value={formState.name}
                                onChange={handleChange}
                                placeholder='Seu nome'
                            />
                            {/* <Label> Imagem de Capa </Label> */}
                            {/* <div className="">
                                <Image
                                    src={bannerPreview || profile.banner_url || ""}
                                    alt="Banner"
                                    width={500}
                                    height={100}
                                    className="object-cover w-full h-40 rounded-md"
                                />
                            </div> */}
                            {/* <Input
                                type='file'
                                accept='image/*'
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setBannerFile(e.target.files[0]);
                                        setBannerPreview(URL.createObjectURL(e.target.files[0]));
                                    }
                                }}
                            /> */}
                        </div>
                    </div>

                    <div className="mx-auto">
                        <h4 className="font-semibold text-center text-sm mb-1">Imagem do Perfil</h4>
                        <div className="flex relative w-fit px-4">
                            <Avatar className="w-[12.5rem] h-[12.5rem]">
                                <AvatarImage
                                    src={preview || profile.avatar_url || undefined}
                                    className="object-cover w-full h-full rounded-full"
                                />
                                <AvatarFallback>
                                    {profile.name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="icon"
                                        className="absolute bottom-3 left-6 backdrop-blur border border-muted-foreground hover:bg-muted transition"
                                        variant={"outline"}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 mt-1">
                                    <DropdownMenuItem
                                        onSelect={() => {
                                            document.getElementById("avatar-upload")?.click();
                                        }}
                                    >
                                        Upload a photo…
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={async () => {
                                            try {
                                                await deleteAvatar();
                                                setProfile((prev) =>
                                                    prev ? { ...prev, avatar_url: null } : prev
                                                );
                                                setAvatarFile(null);
                                                setPreview(null);
                                                toast.success("Avatar removido com sucesso!");
                                            } catch {
                                                toast.error("Erro ao remover avatar");
                                            }
                                        }}
                                    >
                                        Remove photo
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <p className="text-xs mx-1 p-3">
                        Membro desde: {new Date(profile.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                    <Button type="submit" disabled={!hasChanges} className={`${!hasChanges ? 'hidden' : ''}`}>
                        Salvar
                    </Button>
                </div>
            </form>
        </>
    );
}