// components/UserInitializer.tsx
'use client';

import { useUserStore } from '@/app/stores/usuarioStore';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export function UsuarioInfo() {
  const { user } = useUser();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    if (user) {
      const name = user.fullName || user.firstName || 'Usuario';
      const rol = typeof user.publicMetadata.rol === 'string' ? user.publicMetadata.rol : 'invitado';
      const imageUrl = user.imageUrl;
      const email = user.primaryEmailAddress?.emailAddress || 'sin-email';

      setUser(name, rol, imageUrl, email);
    } else {
      clearUser();
    }
  }, [user, setUser, clearUser]);

  return null;
}
