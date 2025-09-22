'use client';

import { useEffect, useState } from 'react';

interface ClientAvatarFallbackProps {
  username?: string | null;
  email?: string | null;
}

export function ClientAvatarFallback({ username, email }: ClientAvatarFallbackProps) {
  const [initials, setInitials] = useState<string>('??');

  useEffect(() => {
    if (username) {
      setInitials(username.charAt(0).toUpperCase());
    } else if (email) {
      setInitials(email.charAt(0).toUpperCase());
    }
  }, [username, email]);

  return <>{initials}</>;
}