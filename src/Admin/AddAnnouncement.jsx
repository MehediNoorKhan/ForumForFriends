import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router";

const AddAnnouncement = () => {
    const axiosSecure = useAxiosSecure();
    const { user, loading } = useAuth();
    const { register, handleSubmit, reset, setValue } = useForm();
    const [uploading, setUploading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false); // ✅ track image upload
    const navigate = useNavigate();
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

    // Redirect if user is not logged in
    useEffect(() => {
        if (!loading && !user) {
            navigate("/joinus");
        }
    }, [user, loading, navigate]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            // Compress image
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);

            const formData = new FormData();
            formData.append("image", compressedFile);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setValue("authorImage", data.data.url, { shouldValidate: true });
                setImageUploaded(true); // ✅ mark as uploaded
            } else {
                throw new Error("Image upload failed");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            const announcementData = {
                authorName: data.authorName,
                authorEmail: user?.email,
                authorImage: data.authorImage,
                title: data.title,
                description: data.description,
                creation_time: new Date(),
            };

            await axiosSecure.post("/announcements", announcementData);

            Swal.fire({
                icon: "success",
                title: "Announcement added successfully",
                confirmButtonColor: "#6b21a8",
            });

            reset();                 // ✅ reset form
            setImageUploaded(false); // ✅ reset image state
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Failed to add announcement",
                text: err?.response?.data?.message || "Something went wrong",
                confirmButtonColor: "#6b21a8",
            });
        }
    };

    if (loading) return <div className="text-center text-white mt-10">Checking authentication...</div>;
    if (!user) return null;

    return (
        <div
            className="max-w-3xl mx-auto mt-6 p-6 rounded shadow"
            style={{ background: "linear-gradient(135deg, #f472b6, #8b5cf6)" }}
        >
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
                Add Announcement
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Author Name */}
                <div>
                    <label className="block mb-1 text-white">Author Name</label>
                    <input
                        type="text"
                        {...register("authorName")}
                        placeholder="Enter author name"
                        className="w-full px-4 py-2 border rounded bg-white border-white focus:outline-none focus:ring-2 focus:ring-white"
                    />
                </div>

                {/* Author Image */}
                <div>
                    <label className="block mb-1 text-white">Author Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-4 py-2 border rounded bg-white border-white focus:outline-none focus:ring-2 focus:ring-white"
                    />
                </div>

                {/* Hidden field for uploaded image */}
                <input type="hidden" {...register("authorImage", { required: true })} />

                {/* Title */}
                <div>
                    <label className="block mb-1 text-white">Title</label>
                    <input
                        type="text"
                        {...register("title")}
                        placeholder="Enter title"
                        className="w-full px-4 py-2 border rounded bg-white border-white focus:outline-none focus:ring-2 focus:ring-white"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-1 text-white">Description</label>
                    <textarea
                        {...register("description")}
                        placeholder="Enter description"
                        rows={4}
                        className="w-full px-4 py-2 border rounded bg-white border-white focus:outline-none focus:ring-2 focus:ring-white"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={uploading || !imageUploaded || !user?.email}
                    className={`px-6 py-2 bg-purple-500 text-white rounded ${uploading || !imageUploaded || !user?.email
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                        }`}
                >
                    Add Announcement
                </button>
            </form>
        </div>
    );
};

export default AddAnnouncement;
