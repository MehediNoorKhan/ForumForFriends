import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import useAuth from "../Hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const Register = () => {
    const [uploading, setUploading] = useState(false);
    const [registering, setRegistering] = useState(false);
    const { createUser, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const password = watch("password");
    const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

    const uploadImageToImgBB = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true);
            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
                { method: "POST", body: formData }
            );
            const result = await res.json();
            setUploading(false);

            if (result.success) return result.data.url;
            console.error("ImgBB upload failed", result);
            return null;
        } catch (err) {
            setUploading(false);
            console.error("Error uploading image:", err);
            return null;
        }
    };

    const saveUserToDB = async (userData) => {
        try {
            const res = await axiosSecure.post("/users", userData);
            if (res.data.message === "User created successfully") {
                console.log("User saved in DB:", res.data);
            }
        } catch (err) {
            if (err.response?.status === 409) {
                console.log("User already exists in DB, skipping creation");
            } else {
                console.error("Error saving user to DB:", err);
            }
        }
    };

    const onSubmit = async (data) => {
        setRegistering(true);

        // Upload avatar
        const imageFile = data.avatar[0];
        const imageUrl = await uploadImageToImgBB(imageFile);
        if (!imageUrl) {
            alert("Image upload failed. Please try again.");
            setRegistering(false);
            return;
        }

        // Create Firebase user
        createUser(data.email, data.password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                // Update Firebase profile
                await updateUserProfile(user, {
                    displayName: data.name,
                    photoURL: imageUrl,
                });

                // Save user in MongoDB
                const userData = {
                    name: data.name,
                    email: data.email,
                    avatar: imageUrl,
                    role: "user",
                    userStatus: "bronze",
                    membership: "no",
                    posts: 0
                };
                await saveUserToDB(userData);
                reset();
                setRegistering(false);
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful",
                    text: "Registration has been done successfully!",
                    confirmButtonColor: "#6b21a8",
                });
            })
            .catch((error) => {
                setRegistering(false);
                console.log(error.message);
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: error.message,
                    confirmButtonColor: "#6b21a8",
                });
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block mb-1 text-gray-600">Name</label>
                        <input
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Enter your name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 text-gray-600">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Avatar */}
                    <div>
                        <label className="block mb-1 text-gray-600">Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("avatar", { required: "Profile image is required" })}
                            className="w-full"
                        />
                        {errors.avatar && (
                            <p className="text-red-500 text-sm mt-1 text-center">{errors.avatar.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 text-gray-600">Password</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                            })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Enter password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block mb-1 text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) => value === password || "Passwords do not match",
                            })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Confirm password"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={uploading || registering}
                        className="w-full py-2 mt-4 font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600 transition disabled:opacity-50"
                    >
                        {registering ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500">
                    Already have an account?{" "}
                    <Link to="/joinus" className="text-purple-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
