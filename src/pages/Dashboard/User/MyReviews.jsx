import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

const MyReviews = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchReviews = () => {
    axiosSecure.get(`/reviews/user/${user.email}`)
      .then(res => setReviews(res.data));
  };

  useEffect(() => { fetchReviews(); }, [user]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Review?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete!",
    });
    if (result.isConfirmed) {
      await axiosSecure.delete(`/reviews/${id}`);
      toast.success("Review deleted!");
      fetchReviews();
    }
  };

  const openEdit = (review) => {
    setEditingReview(review);
    setValue("rating", review.rating);
    setValue("comment", review.comment);
  };

  const onUpdateSubmit = async (data) => {
    await axiosSecure.put(`/reviews/${editingReview._id}`, {
      rating: parseInt(data.rating),
      comment: data.comment,
    });
    toast.success("Review updated!");
    setEditingReview(null);
    reset();
    fetchReviews();
  };

  return (
    <div>
      <Helmet><title>My Reviews | LocalChefBazaar</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">You have not submitted any reviews yet.</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map(review => (
            <div key={review._id}
              className="bg-white rounded-2xl shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">Rating: {review.rating} ⭐</p>
                  <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(review)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition">
                    Update
                  </button>
                  <button onClick={() => handleDelete(review._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
            <button onClick={() => setEditingReview(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
            <h3 className="text-xl font-bold mb-4">Update Review</h3>
            <form onSubmit={handleSubmit(onUpdateSubmit)} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Rating</label>
                <select {...register("rating")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1">
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Comment</label>
                <textarea {...register("comment")} rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"></textarea>
              </div>
              <button type="submit"
                className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold">
                Update Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;