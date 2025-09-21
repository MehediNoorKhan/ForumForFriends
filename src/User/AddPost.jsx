import React, { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useNavigate } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import LoadingSpinner from "../Components/LoadingSpinner";
import useAuth from "../Hooks/useAuth";

const AddPost = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { register, handleSubmit, control, reset, setValue, watch } = useForm();
    const { user, loading } = useAuth(); // get logged-in user

    const [tags, setTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);

    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
    const authorImage = watch("authorImage");

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            navigate("/joinus");
        }
    }, [user, loading, navigate]);

    // Fetch tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await axiosSecure.get("/tags");
                const formattedTags = res.data.map(tag => ({
                    value: tag.name,
                    label: tag.name,
                }));
                setTags(formattedTags);
            } catch (err) {
                console.error("Failed to fetch tags:", err);
                setError("Failed to load tags");
            } finally {
                setLoadingTags(false);
            }
        };
        fetchTags();
    }, [axiosSecure]);

    // Fetch logged-in user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.email) return;
            try {
                const res = await axiosSecure.get(`/users/email/${user.email}`);
                setUserData(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load user data");
            }
        };
        fetchUserData();
    }, [axiosSecure, user]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setImageUploaded(false);

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

            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                { method: "POST", body: formData }
            );
            const data = await res.json();

            if (data.success) {
                setValue("authorImage", data.data.url, { shouldValidate: true });
                setImageUploaded(true); // ✅ mark image as uploaded
            } else {
                throw new Error("Failed to upload image");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            const postData = {
                authorImage: data.authorImage,
                authorName: userData.name,
                authorEmail: userData.email,
                postTitle: data.postTitle,
                postDescription: data.postDescription,
                tag: data.tag.value,
                upVote: 0,
                downVote: 0,
                creation_time: new Date(),
            };

            await axiosSecure.post("/posts", postData);

            Swal.fire({
                icon: "success",
                title: "Post added successfully",
                confirmButtonColor: "#6b21a8",
            });

            // Reset form and image upload state
            reset();
            setImageUploaded(false); // ✅ important
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Failed to add post",
                text: err?.response?.data?.message || "Something went wrong",
                confirmButtonColor: "#6b21a8",
            });
        }
    };

    if (loading || !user) return <LoadingSpinner />; // show spinner while checking login
    if (loadingTags || !userData) return <LoadingSpinner />;
    if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;

    const canAddPost = !(userData.userStatus === "bronze" && userData.posts >= 5);

    if (!canAddPost) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
                <p className="text-lg text-black flex items-center justify-center gap-2">
                    ⚠️ You can not add anymore post
                </p>
                <button
                    onClick={() => navigate("/membership")}
                    className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                >
                    Become a Member
                </button>
            </div>
        );
    }

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "#fff",
            borderColor: "#fff",
            boxShadow: state.isFocused ? "0 0 0 1px #fff" : "none",
            "&:hover": { borderColor: "#fff" },
        }),
        option: (provided) => ({
            ...provided,
            backgroundColor: "#fff",
            color: "#1f2937",
            cursor: "pointer",
        }),
        singleValue: (provided) => ({ ...provided, color: "#1f2937" }),
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-purple-50 rounded shadow mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-500">
                Add New Post
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Author Name */}
                <div>
                    <label className="block mb-1 text-black">Author Name</label>
                    <input
                        type="text"
                        value={userData.name}
                        disabled
                        className="w-full px-4 py-2 border rounded bg-white border-white focus:outline-none focus:ring-2 focus:ring-white"
                    />
                </div>

                {/* Author Email */}
                <div>
                    <label className="block mb-1 text-black">Author Email</label>
                    <input
                        type="email"
                        value={userData.email}
                        disabled
                        className="w-full px-4 py-2 border rounded bg-white border-white focus:outline-none focus:ring-2 focus:ring-white"
                    />
                </div>

                {/* Author Image */}
                <div>
                    <label className="block mb-1 text-black">Author Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-4 py-2 border rounded bg-white border-white focus:outline-none focus:ring-2 focus:ring-white"
                    />
                </div>

                {/* Hidden field for uploaded image */}
                <input type="hidden" {...register("authorImage", { required: true })} />

                {/* Post Title */}
                <div>
                    <label className="block mb-1 text-black">Post Title</label>
                    <input
                        type="text"
                        {...register("postTitle", { required: true })}
                        placeholder="Enter post title"
                        className="w-full px-4 py-2 border rounded bg-white border-white focus:outline-none focus:ring-2 focus:ring-white"
                    />
                </div>

                {/* Post Description */}
                <div>
                    <label className="block mb-1 text-black">Post Description</label>
                    <textarea
                        {...register("postDescription", { required: true })}
                        placeholder="Enter post description"
                        rows={4}
                        className="w-full px-4 py-2 border rounded bg-white border-white focus:outline-none focus:ring-2 focus:ring-white"
                    ></textarea>
                </div>

                {/* Tag */}
                <div>
                    <label className="block mb-1 text-black">Select Tag</label>
                    <Controller
                        name="tag"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select {...field} options={tags} styles={customSelectStyles} />
                        )}
                    />
                </div>

                <button
                    type="submit"
                    disabled={uploading || !imageUploaded}
                    className={`px-6 py-2 bg-purple-500 text-white rounded transition ${uploading || !imageUploaded ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    Add Post
                </button>
            </form>
        </div>
    );
};

export default AddPost;
