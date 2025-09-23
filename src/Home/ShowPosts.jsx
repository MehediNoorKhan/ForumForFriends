import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { AuthContext } from "../Provider/AuthContext";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function ShowPosts() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axiosSecure.get("/posts");
                const normalized = Array.isArray(data.posts) ? data.posts : [];
                const postsWithDefaults = normalized.map((p) => ({
                    ...p,
                    upvoteBy: Array.isArray(p.upvoteBy) ? p.upvoteBy : [],
                    downvoteBy: Array.isArray(p.downvoteBy) ? p.downvoteBy : [],
                    commentsCount: p.commentsCount || 0,
                }));
                setPosts(postsWithDefaults);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setLoading(false);
            }
        };
        fetchPosts();
    }, [axiosSecure]);

    const handleVote = async (postId, type) => {
        if (!user) return Swal.fire("Login required", "You must log in to vote", "error");

        setPosts((prev) =>
            prev.map((p) => {
                if (p._id !== postId) return p;

                let upvoteBy = [...p.upvoteBy];
                let downvoteBy = [...p.downvoteBy];

                if (type === "upvote") {
                    downvoteBy = downvoteBy.filter((e) => e !== user.email);
                    upvoteBy.includes(user.email) ? (upvoteBy = upvoteBy.filter((e) => e !== user.email)) : upvoteBy.push(user.email);
                } else if (type === "downvote") {
                    upvoteBy = upvoteBy.filter((e) => e !== user.email);
                    downvoteBy.includes(user.email) ? (downvoteBy = downvoteBy.filter((e) => e !== user.email)) : downvoteBy.push(user.email);
                }

                return { ...p, upvoteBy, downvoteBy };
            })
        );

        try {
            await axiosSecure.patch(`/posts/${postId}/vote`, { type });
        } catch (err) {
            console.error("Vote error:", err);
        }
    };

    const paginatedPosts = useMemo(() => {
        const start = (currentPage - 1) * postsPerPage;
        return posts.slice(start, start + postsPerPage);
    }, [posts, currentPage]);

    const totalPages = Math.ceil(posts.length / postsPerPage);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Section Title */}
            <h2 className="text-center text-2xl font-bold mt-6">Posts</h2>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post) => (
                    <div
                        key={post._id}
                        className="rounded-2xl p-4 cursor-pointer hover:shadow-xl transition shadow-lg"
                        style={{ background: "linear-gradient(135deg, #7e5bef, #3b82f6)" }}
                        onClick={(e) => {
                            if (!e.target.closest(".action-btn")) navigate(`/post/${post._id}`);
                        }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <img
                                    src={post.authorImage || "/default-avatar.png"}
                                    alt={post.authorName}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-bold text-white">{post.authorName}</p>
                                    <p className="text-xs text-gray-200">{new Date(post.creation_time).toLocaleString()}</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs bg-pink-100 text-pink-600 rounded-full">{post.tag}</span>
                        </div>

                        <h3 className="font-bold text-lg mb-1 text-white">{post.postTitle}</h3>
                        <p className="text-gray-100 text-sm mb-3 line-clamp-3">{post.postDescription}</p>

                        <div className="flex gap-2">
                            <div className="action-btn flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 bg-opacity-30 text-gray-200 rounded-full">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVote(post._id, "upvote");
                                    }}
                                    className={`flex items-center gap-1 ${post.upvoteBy.includes(user?.email) ? "text-green-800 font-bold" : "text-gray-700"}`}
                                >
                                    <ThumbsUp size={16} /> {post.upvoteBy.length}
                                </button>

                                <span className="text-gray-400">|</span>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVote(post._id, "downvote");
                                    }}
                                    className={`flex items-center gap-1 ${post.downvoteBy.includes(user?.email) ? "text-red-800 font-bold" : "text-gray-700"}`}
                                >
                                    <ThumbsDown size={16} /> {post.downvoteBy.length}
                                </button>
                            </div>

                            <div className="action-btn flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 bg-opacity-30 text-blue-600 rounded-full">
                                <MessageSquare size={16} /> {post.commentsCount || 0}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-6">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
