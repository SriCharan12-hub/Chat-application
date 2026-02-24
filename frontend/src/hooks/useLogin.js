import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, loginWithGoogle, verifyMFA } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mfaRequired, setMfaRequired] = useState(false);
  const [userId, setUserId] = useState(null);

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: (data) => {
      if (data.otp) {
        return verifyMFA(data);
      }
      if (typeof data === "string") {
        return loginWithGoogle(data);
      }
      return login(data);
    },
    onSuccess: (data) => {
      if (data.mfaRequired) {
        toast.success("MFA code sent to your email");
        setMfaRequired(true);
        setUserId(data.userId);
        return;
      }
      toast.success("Login successful");
      navigate("/");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { loginMutation, isPending, error, mfaRequired, userId };
};

export default useLogin;
