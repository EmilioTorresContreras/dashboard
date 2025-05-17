'use client';

import { UserButton, useUser } from '@clerk/nextjs';

export default function UserProfileButton() {
  const { isSignedIn, user } = useUser();
  
  if (!isSignedIn) return null;
  
  return (
    <div className="flex text-sm items-center gap-4">
      <span>Hola, {user.firstName || user.username}</span>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}