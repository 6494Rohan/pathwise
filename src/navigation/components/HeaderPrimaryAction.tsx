import React from 'react';
import { SignUpHeaderButton, useSession } from '@/features/auth';
import { UploadResumeButton } from '@/features/profile';

export default function HeaderPrimaryAction() {
  const { data: user, isPending } = useSession();

  if (isPending) return null;
  return user ? <UploadResumeButton /> : <SignUpHeaderButton />;
}
