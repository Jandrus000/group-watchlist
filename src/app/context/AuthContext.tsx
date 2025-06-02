'use client';

import {createContext, useContext} from 'react';
import { useAuth } from '../lib/firebase/auth';
import { User } from 'firebase/auth';
import React from 'react';

type AuthContextType = {
    user: User | null;
    loading: boolean
}

const defaultAuthContext: AuthContextType = {
    user: null,
    loading: true,
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const auth = useAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>

}

export const useAuthContext = () => useContext(AuthContext);