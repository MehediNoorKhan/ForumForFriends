import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";
import Swal from "sweetalert2";
import { ThumbsUp, ThumbsDown, MessageSquare, Share2 } from "lucide-react";
import { FacebookShareButton, FacebookIcon } from "react-share";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function PostDetails() {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Fetch post details
    const fetchPost = async () => {
        try {
            const { data } = await axiosSecure.get(`/posts/${id}`);
            setPost({
                ...data.post,
                upvoteBy: data.post.upvoteBy || [],
                downvoteBy: data.post.downvoteBy || [],
            });
            setComments(data.comments || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    const handleVote = async (type) => {
        if (!user) {
            Swal.fire("Login required", "You must be logged in to vote", "error");
            return;
        }

        // Optimistic update
        setPost((prev) => {
            if (!prev) return prev;

            let updatedUpvotes = [...prev.upvoteBy];
            let updatedDownvotes = [...prev.downvoteBy];

            if (type === "upvote") {
                // remove user from downvotes if present
                updatedDownvotes = updatedDownvotes.filter((e) => e !== user.email);
                // toggle upvote
                if (updatedUpvotes.includes(user.email)) {
                    updatedUpvotes = updatedUpvotes.filter((e) => e !== user.email);
                } else {
                    updatedUpvotes.push(user.email);
                }
            } else if (type === "downvote") {
                // remove user from upvotes if present
                updatedUpvotes = updatedUpvotes.filter((e) => e !== user.email);
                // toggle downvote
                if (updatedDownvotes.includes(user.email)) {
                    updatedDownvotes = updatedDownvotes.filter((e) => e !== user.email);
                } else {
                    updatedDownvotes.push(user.email);
                }
            }

            return {
                ...prev,
                upvoteBy: updatedUpvotes,
                downvoteBy: updatedDownvotes,
            };
        });

        // Sync with backend
        try {
            await axiosSecure.patch(`/posts/${id}/vote`, { type });
        } catch (err) {
            console.error(err);
            // TODO: Rollback if API fails (optional)
        }
    };


    const handleComment = async () => {
        if (!user) {
            setShowLoginModal(true); // open modal instead of Swal
            return;
        }
        if (!newComment.trim()) return;

        try {
            const { data } = await axiosSecure.post(`/posts/${id}/comment`, { comment: newComment });
            setComments([data, ...comments]); // prepend new comment
            setNewComment("");
        } catch (err) {
            console.error(err);
        }
    };

    if (!post) return <LoadingSpinner />;

    const shareUrl = window.location.href;

    return (
        <div className="max-w-3xl mx-auto mt-6 space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-3">
                    <img
                        src={post.authorImage || "/default-avatar.png"}
                        alt={post.authorName}
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <p className="font-bold">{post.authorName}</p>
                        <p className="text-xs text-gray-500">
                            {new Date(post.creation_time).toLocaleString()}
                        </p>
                    </div>
                    <span className="ml-auto px-2 py-1 text-xs bg-pink-100 text-pink-600 rounded-full">
                        {post.tag}
                    </span>
                </div>

                {/* Post Content */}
                <h2 className="font-bold text-xl mb-2">{post.postTitle}</h2>
                <p className="text-gray-700 mb-4">{post.postDescription}</p>

                {/* Actions */}
                <div className="flex gap-4 mb-3">
                    <button
                        onClick={() => handleVote("upvote")}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full ${post.upvoteBy.includes(user?.email)
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        <ThumbsUp size={16} /> {post.upvoteBy.length}
                    </button>

                    <button
                        onClick={() => handleVote("downvote")}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full ${post.downvoteBy.includes(user?.email)
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        <ThumbsDown size={16} /> {post.downvoteBy.length}
                    </button>

                    <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                        <MessageSquare size={16} /> {comments.length}
                    </div>

                    {/* Share Button */}
                    <FacebookShareButton url={shareUrl} quote={post.postTitle}>
                        <div className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full cursor-pointer">
                            <Share2 size={16} /> Share
                        </div>
                    </FacebookShareButton>
                </div>

                {/* Add Comment */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        className="flex-1 border rounded px-3 py-2"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        onClick={handleComment}
                        className="bg-purple-600 text-white px-4 py-2 rounded"
                    >
                        Comment
                    </button>
                </div>

                {/* Comments Section */}
                <div className="space-y-3">
                    {comments.map((c) => (
                        <div
                            key={c._id}
                            className="flex gap-2 items-start bg-gray-50 p-2 rounded"
                        >
                            <img
                                src={c.commenterImage || "/default-avatar.png"}
                                alt={c.commenterName}
                                className="w-8 h-8 rounded-full"
                            />
                            <div>
                                <p className="font-semibold text-sm">{c.commenterName}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(c.createdAt).toLocaleString()}
                                </p>
                                <p>{c.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
                        <p className="mb-4 text-gray-700 font-medium">
                            You need to login to comment
                        </p>
                        <button
                            onClick={() => navigate("/joinus")}
                            className="bg-purple-600 text-white px-4 py-2 rounded w-full"
                        >
                            Go to Login
                        </button>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="mt-2 text-sm text-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
