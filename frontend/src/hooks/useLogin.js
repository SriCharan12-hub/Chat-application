import { useMutation, useQueryClient } from "@tanstack/react-query"
import { login } from "../lib/api"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

const useLogin = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    
    const {mutate: loginMutation, isPending, error} = useMutation({
    mutationFn:login,
    onSuccess:()=>{
      toast.success("Login successful");
      navigate("/");
      queryClient.invalidateQueries({queryKey:["authUser"]})
    }
  })

  return {loginMutation, isPending, error}
}

export default useLogin