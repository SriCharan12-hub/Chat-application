import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { signup, verifyEmail, login } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {toast} from 'react-hot-toast'

const useSignup = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const {mutate:signupMutation, isPending, error} = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      //toast.success("Account created successfully");
        // Handled in component
    },
    onError: (err) => {
        console.log("Signup error:", err);
    }
  })

  const {mutate: verifyMutation, isPending: isVerifying, error: verifyError} = useMutation({
    mutationFn: verifyEmail,
    onSuccess: async (data) => {
        toast.success("Email verified successfully");
        // Manually login or just invalidate queries if token is set by verifyEmail
        queryClient.invalidateQueries({queryKey:["authUser"]})
        navigate("/onboarding"); 
    },
    onError: (err) => {
        toast.error(err.response?.data?.message || "Verification failed");
    }
  })

  return {signupMutation, isPending, error, verifyMutation, isVerifying, verifyError}
}

export default useSignup