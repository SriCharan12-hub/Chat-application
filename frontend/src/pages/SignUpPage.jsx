import React from "react";
import { Link } from "react-router-dom";
import { ShipWheelIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import useSignup from "../hooks/useSignup";
import useLogin from "../hooks/useLogin";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { EMAIL_REGEX, PASSWORD_REGEX, NAME_REGEX } from "../lib/utilis";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");

  const [signupData, setSignupData] = useState({
    FullName: "",
    Email: "",
    Password: "",
  });

  const { signupMutation, isPending, error, verifyMutation, isVerifying } =
    useSignup();
  const { loginMutation: googleLoginMutation } = useLogin();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!NAME_REGEX.test(signupData.FullName)) {
      return toast.error("Full Name must contain only alphabets and spaces");
    }
    if (!EMAIL_REGEX.test(signupData.Email)) {
      return toast.error("Invalid Email Format");
    }
    if (!PASSWORD_REGEX.test(signupData.Password)) {
      return toast.error(
        "Password must be at least 6 characters long and contain at least one letter and one number",
      );
    }

    signupMutation(signupData, {
      onSuccess: (data) => {
        if (data.needVerification) {
          setUserId(data.userId);
          setShowOtpInput(true);
        }
      },
    });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter OTP");
    verifyMutation({ userId, otp });
  };

  const handleBack = () => {
    setShowOtpInput(false);
    setOtp("");
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* signup form - left side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center">
          <div className="mb-4 flex  items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              ChatBox
            </span>
          </div>

          {/*Error message*/}

          {error && (
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                {error.response?.data?.message || "Something went wrong"}
              </span>
            </div>
          )}

          <div className="w-full">
            <div className="w-full">
              {showOtpInput ? (
                <form onSubmit={handleVerify}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Verify Your Email
                      </h2>
                      <p className="text-sm opacity-70">
                        Enter the 6-digit code sent to your email
                      </p>
                    </div>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">OTP</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        className="input input-bordered w-full text-center tracking-widest text-2xl"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Verifying...
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost w-full mt-2"
                      onClick={handleBack}
                      disabled={isVerifying}
                    >
                      Back to Signup
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignup}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Create An Account
                      </h2>
                      <p className="text-sm opacity-70">
                        Join Streamify and Start your language learning
                        adventure!
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text">Full Name</span>
                        </label>

                        <input
                          type="text"
                          placeholder="Enter your full name"
                          className="input input-bordered w-full"
                          value={signupData.FullName}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              FullName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text">Email</span>
                        </label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="input input-bordered w-full"
                          value={signupData.Email}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              Email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text">Password</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="input input-bordered w-full pr-10"
                            value={signupData.Password}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
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
                        <p className="text-xs opacity-70 mt-l">
                          Password must be atleast 6 characters long
                        </p>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer justify-center gap-2">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            required
                          />
                          <span className="label-text">
                            I agree to the{" "}
                            <span className="text-primary hover:underline">
                              terms and conditions
                            </span>{" "}
                            and{" "}
                            <span className="text-primary hover:underline">
                              privacy policy
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Loading...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>

                    <div className="divider">OR</div>

                    <div className="flex justify-center w-full">
                      <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                          try {
                            await googleLoginMutation(
                              credentialResponse.credential,
                            );
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
                      <p>
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="text-primary hover:underline"
                        >
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* signup form - right side */}

        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="https://i.pinimg.com/736x/97/a6/46/97a646803836901b1a3c8f83bbff685c.jpg"
                alt="Language connection"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-70">
                {" "}
                practice conversation, make friends, and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
