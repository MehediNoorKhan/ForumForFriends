import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JoinUs = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { login, setUser } = useAuth();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        login(data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user);

                // ✅ Show toast
                toast.success("Login successful", {
                    position: "top-right",
                    autoClose: 3000,
                });

                // ✅ Redirect after short delay so toast shows
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            })
            .catch((error) => {
                console.error(error.message);
                toast.error("Login failed. Check your credentials.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            {/* ToastContainer to render notifications */}
            <ToastContainer />

            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Join Us
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block mb-1 text-gray-600">Email</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Entered value is not a valid email",
                                },
                            })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 text-gray-600">Password</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must have at least 6 characters",
                                },
                            })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-purple-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default JoinUs;
