import {ReactNode, useEffect, useState} from 'react'
import { AuthContext } from './AuthContext'
import {postman} from '../postman.ts'

interface AuthProviderProps {
    children ?: ReactNode,
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
    const [role, setRole] = useState<'DEFAULT' | 'CUSTOMER' | 'OWNER'>('DEFAULT')

    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            postman.post('/validate-token')
                .then((res) => {
                    const user = res.data.user
                    setAuthenticated(true)
                    setRole(user.role)
                })
        }
    }, [])

    return <AuthContext.Provider value={{
        isAuthenticated,
        setAuthenticated,
        role,
        setRole
    }}>
        {children as ReactNode}
    </AuthContext.Provider>
}
