import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { logout } from '../lib/api'

const useLogout = () => {

    const navigate = useNavigate()
    const QueryClient = useQueryClient()

    const {mutate:logoutMutation,isPending,error} = useMutation({
        mutationFn: logout,
        onSuccess: () => {
           navigate("/login")
           QueryClient.invalidateQueries({
            queryKey: ["authUser"]
           })
        }
    })
    return {logoutMutation,isPending,error}
}

export default useLogout