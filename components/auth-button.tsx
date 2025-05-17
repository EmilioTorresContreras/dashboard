// components/AuthButtons.tsx
'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from './ui/button';
import { User, UserPlus } from 'lucide-react';

export default function AuthButtons() {
    const { isSignedIn, signOut } = useAuth();

    if (isSignedIn) {
        return (
            <Button variant="outline"
                onClick={() => signOut()}

            >
                Cerrar sesión
            </Button>
        );
    }

    return (
        <div className="flex h-full items-center justify-center">
            <div className="flex flex-row">
            <Button className='m-2'>
                <Link href="/sign-in">
                <div className="flex items-center justify-center gap-1 w-full">
                    <User /> Acceder
                </div>
                </Link>
            </Button>
            <Button className='m-2'>
                <Link href="/sign-up">
                    <UserPlus/>
                </Link>
            </Button>
            </div>
        </div>
    );
}