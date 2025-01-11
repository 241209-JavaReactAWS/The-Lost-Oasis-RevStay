import {ReactNode, useState} from 'react'
import { AuthContext } from './AuthContext'

interface AuthProviderProps {
    children ?: ReactNode,
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
    const [role, setRole] = useState<'DEFAULT' | 'CUSTOMER' | 'OWNER'>('DEFAULT')

    return <AuthContext.Provider value={{
        isAuthenticated,
        setAuthenticated,
        role,
        setRole
    }}>
        {children as ReactNode}
    </AuthContext.Provider>
}
