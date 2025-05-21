import PasswordPage from '@/components/password';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PasswordPage />
    </Suspense>
  );
}