import React, { createContext, useContext, useState, useCallback } from 'react';
import { StructuredAddress } from '@/types';

interface AddressContextType {
  selectedAddress: StructuredAddress | null;
  setSelectedAddress: (address: StructuredAddress | null) => void;
  clearSelectedAddress: () => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [selectedAddress, setSelectedAddressState] = useState<StructuredAddress | null>(null);

  const setSelectedAddress = useCallback((address: StructuredAddress | null) => {
    setSelectedAddressState(address);
  }, []);

  const clearSelectedAddress = useCallback(() => {
    setSelectedAddressState(null);
  }, []);

  return (
    <AddressContext.Provider value={{ selectedAddress, setSelectedAddress, clearSelectedAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddressContext() {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddressContext must be used within AddressProvider');
  }
  return context;
}
