import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { signup } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

const useSignup = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const {mutate:signupMutation, isPending, error} = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      //toast.success("Account created successfully");
      navigate("/onboarding");
      queryClient.invalidateQueries({queryKey: ["authUser"]})
    },
    onError: (err) => {
        console.log("Signup error:", err);
    }
})

return {signupMutation, isPending, error}
}

export default useSignup