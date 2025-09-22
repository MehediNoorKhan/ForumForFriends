import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";
import Swal from "sweetalert2";

export default function ShowPosts() {
    const [posts, setPosts] = useState([]);
    const [sortType, setSortType] = useState("newest"); // "newest" | "popularity"
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const postsPerPage = 5;

    // Fetch posts once
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axiosSecure.get("/posts", {
                    params: { page: 1, limit: 100 }, // fetch enough for client-side sorting
                });
                // Normalize posts
                const normalized = data.posts.map((p) => ({
                    ...p,
                    upvoteBy: Array.isArray(p.upvoteBy) ? p.upvoteBy : [],
                    downvoteBy: Array.isArray(p.downvoteBy) ? p.downvoteBy : [],
                }));
                setPosts(normalized);
                setTotalPages(Math.ceil(normalized.length / postsPerPage));
            } catch (err) {
                console.error("Error fetching posts:", err);
            }
        };
        fetchPosts();
    }, [axiosSecure]);

    // Client-side sorted posts
    const sortedPosts = useMemo(() => {
        let sorted = [...posts];
        if (sortType === "popularity") {
            sorted.sort((a, b) => (b.upvoteBy.length - b.downvoteBy.length) - (a.upvoteBy.length - a.downvoteBy.length));
        } else {
            // newest first
            sorted.sort((a, b) => new Date(b.creation_time) - new Date(a.creation_time));
        }
        // Pagination
        const start = (currentPage - 1) * postsPerPage;
        return sorted.slice(start, start + postsPerPage);
    }, [posts, sortType, currentPage]);

    const handleSort = (type) => {
        setSortType(type);
        setCurrentPage(1); // reset page
    };

    const handleVote = async (postId, type) => {
        if (!user) {
            Swal.fire({
                icon: "error",
                title: "Login required",
                text: "You must be logged in to vote",
            });
            return;
        }

        const userEmail = user.email;

        // Optimistic UI update
        setPosts((prev) =>
            prev.map((p) => {
                if (p._id === postId) {
                    let upvoteBy = [...p.upvoteBy];
                    let downvoteBy = [...p.downvoteBy];

                    if (type === "upvote") {
                        if (!upvoteBy.includes(userEmail)) upvoteBy.push(userEmail);
                        downvoteBy = downvoteBy.filter((e) => e !== userEmail);
                    } else if (type === "downvote") {
                        if (!downvoteBy.includes(userEmail)) downvoteBy.push(userEmail);
                        upvoteBy = upvoteBy.filter((e) => e !== userEmail);
                    }

                    return { ...p, upvoteBy, downvoteBy };
                }
                return p;
            })
        );

        // Update server
        try {
            await axiosSecure.patch(`/posts/${postId}/vote`, { type });
        } catch (err) {
            console.error("Vote error:", err);
            // Optionally: revert optimistic update
        }
    };

    return (
        <div className="space-y-6">
            {/* Sort Buttons */}
            <div className="flex gap-3 justify-end mb-4">
                <button
                    onClick={() => handleSort("newest")}
                    className={`px-4 py-2 rounded-lg ${sortType === "newest" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
                >
                    Sort by Newest
                </button>
                <button
                    onClick={() => handleSort("popularity")}
                    className={`px-4 py-2 rounded-lg ${sortType === "popularity" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
                >
                    Sort by Popularity
                </button>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPosts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-white shadow-lg rounded-2xl p-4 cursor-pointer hover:shadow-xl transition"
                        onClick={(e) => {
                            if (!e.target.closest(".action-btn")) navigate(`/posts/${post._id}`);
                        }}
                    >
                        {/* Author + Tag */}
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <img src={post.authorImage || "/default-avatar.png"} alt={post.authorName} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold">{post.authorName}</p>
                                    <p className="text-xs text-gray-500">{new Date(post.creation_time).toLocaleString()}</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs bg-pink-100 text-pink-600 rounded-full">{post.tag}</span>
                        </div>

                        <h3 className="font-bold text-lg mb-1">{post.postTitle}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.postDescription}</p>

                        {/* Votes + Comments */}
                        <div className="flex gap-2">
                            <div className="action-btn flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleVote(post._id, "upvote"); }}
                                    className={`flex items-center gap-1 ${post.upvoteBy.includes(user?.email) ? "text-green-600 font-bold" : "text-gray-500"}`}
                                >
                                    <ThumbsUp size={16} /> {post.upvoteBy.length}
                                </button>

                                <span className="text-gray-400">|</span>

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleVote(post._id, "downvote"); }}
                                    className={`flex items-center gap-1 ${post.downvoteBy.includes(user?.email) ? "text-red-600 font-bold" : "text-gray-500"}`}
                                >
                                    <ThumbsDown size={16} /> {post.downvoteBy.length}
                                </button>
                            </div>

                            <button
                                className="action-btn flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded-full"
                                onClick={() => navigate(`/posts/${post._id}`)}
                            >
                                <MessageSquare size={16} /> {post.commentsCount || 0}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-6">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
                <span className="font-semibold">Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
            </div>
        </div>
    );
}
