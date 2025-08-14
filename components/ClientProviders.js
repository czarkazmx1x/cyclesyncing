'use client';

import { AuthProvider } from '../contexts/AuthContext';
import { CycleProvider } from '../contexts/CycleContext';

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <CycleProvider>
        {children}
      </CycleProvider>
    </AuthProvider>
  );
}