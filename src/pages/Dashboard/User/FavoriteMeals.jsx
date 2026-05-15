import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const FavoriteMeals = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = () => {
    axiosSecure.get(`/favorites/${user.email}`)
      .then(res => setFavorites(res.data));
  };

  useEffect(() => { fetchFavorites(); }, [user]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Remove from Favorites?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Remove!",
    });
    if (result.isConfirmed) {
      await axiosSecure.delete(`/favorites/${id}`);
      toast.success("Meal removed from favorites successfully.");
      fetchFavorites();
    }
  };

  return (
    <div>
      <Helmet><title>Favorite Meals | LocalChefBazaar</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Favorite Meals</h2>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorite meals yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow overflow-hidden">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Meal Name</th>
                <th className="py-3 px-4 text-left">Chef Name</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Date Added</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((fav, i) => (
                <tr key={fav._id}
                  className={i % 2 === 0 ? "bg-white" : "bg-orange-50"}>
                  <td className="py-3 px-4">{fav.mealName}</td>
                  <td className="py-3 px-4">{fav.chefName}</td>
                  <td className="py-3 px-4">${fav.price}</td>
                  <td className="py-3 px-4">
                    {new Date(fav.addedTime).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleDelete(fav._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FavoriteMeals;