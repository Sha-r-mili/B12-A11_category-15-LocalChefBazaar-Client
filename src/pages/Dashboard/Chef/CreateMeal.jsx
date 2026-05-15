import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const CreateMeal = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [dbUser, setDbUser] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    axiosSecure.get(`/users/${user.email}`).then(res => setDbUser(res.data));
  }, [user]);

  const onSubmit = async (data) => {
    // Check fraud status
    if (dbUser?.status === "fraud") {
      return toast.error("You are restricted from creating meals.");
    }

    const ingredientsArray = data.ingredients.split(",").map(i => i.trim());

    try {
      await axiosSecure.post("/meals", {
        foodName: data.foodName,
        chefName: data.chefName,
        foodImage: data.foodImage,
        price: parseFloat(data.price),
        rating: 0,
        ingredients: ingredientsArray,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
        chefId: dbUser?.chefId,
        deliveryArea: data.deliveryArea,
        userEmail: user.email,
      });
      toast.success("Meal created successfully!");
      reset();
    } catch {
      toast.error("Failed to create meal!");
    }
  };

  return (
    <div>
      <Helmet><title>Create Meal | LocalChefBazaar</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Meal</h2>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Food Name", name: "foodName", placeholder: "Chicken Biryani" },
            { label: "Chef Name", name: "chefName", placeholder: "Your name" },
            { label: "Food Image URL", name: "foodImage", placeholder: "https://image-url.com" },
            { label: "Price ($)", name: "price", placeholder: "12.99", type: "number" },
            { label: "Delivery Area", name: "deliveryArea", placeholder: "Dhaka, Mirpur" },
            { label: "Estimated Delivery Time", name: "estimatedDeliveryTime", placeholder: "30 minutes" },
            { label: "Chef Experience", name: "chefExperience", placeholder: "5 years in Bangladeshi cuisine" },
          ].map(field => (
            <div key={field.name}>
              <label className="text-sm font-medium text-gray-700">{field.label}</label>
              <input type={field.type || "text"}
                {...register(field.name, { required: `${field.label} is required` })}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-orange-400" />
              {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>}
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Ingredients (comma separated)</label>
            <textarea {...register("ingredients", { required: "Ingredients are required" })}
              rows={3} placeholder="Chicken, Rice, Spices, Oil"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-orange-400"></textarea>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Chef ID</label>
            <input value={dbUser?.chefId || "Not assigned yet"} readOnly
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Your Email</label>
            <input value={user.email} readOnly
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 mt-1" />
          </div>

          <div className="md:col-span-2">
            <button type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition">
              Create Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeal;