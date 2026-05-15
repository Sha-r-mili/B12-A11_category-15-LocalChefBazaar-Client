import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

const MyMeals = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [meals, setMeals] = useState([]);
  const [editingMeal, setEditingMeal] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchMeals = () => {
    axiosSecure.get(`/meals/chef/${user.email}`)
      .then(res => setMeals(res.data));
  };

  useEffect(() => { fetchMeals(); }, [user]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Meal?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete!",
    });
    if (result.isConfirmed) {
      await axiosSecure.delete(`/meals/${id}`);
      toast.success("Meal deleted!");
      fetchMeals();
    }
  };

  const openEdit = (meal) => {
    setEditingMeal(meal);
    setValue("foodName", meal.foodName);
    setValue("price", meal.price);
    setValue("estimatedDeliveryTime", meal.estimatedDeliveryTime);
    setValue("deliveryArea", meal.deliveryArea);
  };

  const onUpdateSubmit = async (data) => {
    await axiosSecure.put(`/meals/${editingMeal._id}`, data);
    toast.success("Meal updated!");
    setEditingMeal(null);
    reset();
    fetchMeals();
  };

  return (
    <div>
      <Helmet><title>My Meals | LocalChefBazaar</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Meals</h2>

      {meals.length === 0 ? (
        <p className="text-gray-500">You have not created any meals yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meals.map(meal => (
            <div key={meal._id} className="bg-white rounded-2xl shadow p-4">
              <img src={meal.foodImage} alt={meal.foodName}
                className="w-full h-40 object-cover rounded-xl mb-3" />
              <h3 className="font-bold text-gray-800">{meal.foodName}</h3>
              <p className="text-sm text-gray-500">Chef: {meal.chefName}</p>
              <p className="text-sm text-gray-500">Chef ID: {meal.chefId}</p>
              <p className="text-sm text-gray-500">Price: ${meal.price}</p>
              <p className="text-sm text-gray-500">Rating: {meal.rating} ⭐</p>
              <p className="text-sm text-gray-500">Delivery: {meal.estimatedDeliveryTime}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(meal)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition">
                  Update
                </button>
                <button onClick={() => handleDelete(meal._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
            <button onClick={() => setEditingMeal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
            <h3 className="text-xl font-bold mb-4">Update Meal</h3>
            <form onSubmit={handleSubmit(onUpdateSubmit)} className="flex flex-col gap-4">
              {["foodName", "price", "estimatedDeliveryTime", "deliveryArea"].map(field => (
                <div key={field}>
                  <label className="text-sm font-medium text-gray-700 capitalize">{field}</label>
                  <input {...register(field)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-orange-400" />
                </div>
              ))}
              <button type="submit"
                className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold">
                Update Meal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMeals;