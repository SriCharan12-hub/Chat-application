import React from "react";
import { useState } from "react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { ShipWheelIcon, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { EMAIL_REGEX } from "../lib/utilis";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    Email: "",
    Password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { loginMutation, isPending, error, mfaRequired, userId } = useLogin();
  const [otp, setOtp] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(loginData.Email)) {
      return toast.error("Invalid Email Format");
    }
    loginMutation(loginData);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return toast.error("OTP must be 6 digits");
    }
    loginMutation({ userId, otp });
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl overflow-hidden shadow-lg">
        {/* Login form section */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center">
          {/*Logo */}
          <div className="flex items-center justify-start mb-4 gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold text-primary font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Chatbox
            </span>
          </div>
          {/* Error Message Display*/}

          {error && (
            <div className="alert alert-error mb-4">
              <span>
                {error.response?.data?.message || "Something went wrong"}
              </span>
            </div>
          )}

          <div className="w-full">
            {!mfaRequired ? (
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Welcome Back</h2>
                    <p className="text-sm opacity-70">
                      Sign in to your account to continue your language journey
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="form-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        placeholder="email"
                        className="input input-bordered w-full"
                        value={loginData.Email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, Email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text">Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          className="input input-bordered w-full pr-10"
                          value={loginData.Password}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              Password: e.target.value,
                            })
                          }
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="size-5 text-base-content/40" />
                          ) : (
                            <Eye className="size-5 text-base-content/40" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Signing in...
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                    <div className="divider">OR</div>

                    <div className="flex justify-center w-full">
                      <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                          try {
                            await loginMutation(credentialResponse.credential);
                          } catch (err) {
                            toast.error(err.message);
                          }
                        }}
                        onError={() => {
                          toast.error("Login Failed");
                        }}
                        useOneTap
                        type="standard"
                        theme="filled_black"
                        size="large"
                        shape="pill"
                        width="100%"
                      />
                    </div>

                    <div className="text-center mt-4">
                      <p className="text-sm">
                        Don't have an account?{""}{" "}
                        <Link
                          to="/signup"
                          className="text-primary hover:underline"
                        >
                          Create One
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">MFA Verification</h2>
                    <p className="text-sm opacity-70">
                      Please enter the 6-digit code sent to your email
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="form-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text">OTP Code</span>
                      </label>
                      <input
                        type="text"
                        placeholder="123456"
                        className="input input-bordered w-full text-center text-2xl tracking-widest font-bold"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Verifying...
                        </>
                      ) : (
                        <span>Verify OTP</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Image section */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}

            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="https://i.pinimg.com/736x/97/a6/46/97a646803836901b1a3c8f83bbff685c.jpg"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-3xl font-bold text-primary">
                Connect with language partners worldwide
              </h2>
              <p className=" opacity-70">
                Practice conversation, make new friends, and improve your
                language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
