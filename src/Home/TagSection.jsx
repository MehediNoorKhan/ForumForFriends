import React, { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import LoadingSpinner from "../Components/LoadingSpinner";

const TagSection = ({ onTagSelect }) => {
    const [tags, setTags] = useState([]);
    const axiosSecure = useAxiosSecure();

    // Predefined colors for tags
    const colors = [
        "bg-purple-200 text-purple-800 hover:bg-purple-300",
        "bg-blue-200 text-blue-800 hover:bg-blue-300",
        "bg-green-200 text-green-800 hover:bg-green-300",
        "bg-yellow-200 text-yellow-800 hover:bg-yellow-300",
        "bg-pink-200 text-pink-800 hover:bg-pink-300",
        "bg-indigo-200 text-indigo-800 hover:bg-indigo-300",
        "bg-red-200 text-red-800 hover:bg-red-300",
        "bg-teal-200 text-teal-800 hover:bg-teal-300",
        "bg-orange-200 text-orange-800 hover:bg-orange-300",
    ];

    useEffect(() => {
        axiosSecure
            .get("/tags")
            .then((res) => setTags(res.data))
            .catch((err) => console.error("Failed to fetch tags", err));
    }, [axiosSecure]);

    if (!tags.length) return <LoadingSpinner />;

    return (
        <div className="p-6 rounded-lg shadow mt-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Search by Tags</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {tags.map((tag, idx) => (
                    <button
                        key={tag._id}
                        onClick={() => onTagSelect(tag.name)}
                        className={`px-4 py-2 rounded-full cursor-pointer transition ${colors[idx % colors.length]}`}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TagSection;
