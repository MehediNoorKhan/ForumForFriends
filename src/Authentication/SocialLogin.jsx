import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const SocialLogin = () => {
    const { googleLogin, setUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await googleLogin();
            const user = result.user;
            setUser(user);

            // Prepare user data
            const userData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                userStatus: "user", // new field
                membership: "no"    // new field
            };

            // Send to backend (insert only if not exists)
            await axiosSecure.post("/users", userData);

            toast.success("Login successful with Google", {
                position: "top-right",
                autoClose: 3000,
            });
            navigate("/");
        } catch (err) {
            console.error(err.message);
            toast.error("Google login failed or something went wrong.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="mt-6">
            {/* Divider */}
            <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Button */}
            <button
                onClick={handleGoogleLogin}
                className="btn w-full bg-white text-black border border-[#e5e5e5] hover:bg-gray-100 flex items-center gap-2"
            >
                <svg
                    aria-label="Google logo"
                    width="18"
                    height="18"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                >
                    <g>
                        <path d="m0 0H512V512H0" fill="#fff"></path>
                        <path
                            fill="#34a853"
                            d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                        ></path>
                        <path
                            fill="#4285f4"
                            d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                        ></path>
                        <path
                            fill="#fbbc02"
                            d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                        ></path>
                        <path
                            fill="#ea4335"
                            d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                        ></path>
                    </g>
                </svg>
                Login with Google
            </button>
        </div>
    );
};

export default SocialLogin;
