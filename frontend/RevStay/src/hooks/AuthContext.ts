import {createContext} from 'react'

export interface AuthContextType {
    isAuthenticated: boolean,
    setAuthenticated: (isAuthenticated: boolean) => void,
    role: 'DEFAULT' | 'CUSTOMER' | 'OWNER',
    setRole: (role: 'DEFAULT' | 'CUSTOMER' | 'OWNER') => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
