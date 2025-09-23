import { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function Announcements() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch announcements from backend
    const fetchAnnouncements = async () => {
        try {
            const { data } = await axiosSecure.get("/announcements");
            setAnnouncements(data.announcements || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching announcements:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mt-6 bg-gray-50 p-6 rounded-xl shadow-md">
            {/* Section Title */}
            <h2 className="font-bold text-xl mb-4">Announcements</h2>

            {/* List of announcements */}
            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <p className="text-gray-500">No announcements available</p>
                ) : (
                    announcements.map((ann) => (
                        <div
                            key={ann._id}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                        >
                            {/* Title and time */}
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-semibold text-lg">{ann.title}</h3>
                                <span className="text-xs text-gray-500">
                                    {new Date(ann.creation_time).toLocaleString()}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-700 text-sm">{ann.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
