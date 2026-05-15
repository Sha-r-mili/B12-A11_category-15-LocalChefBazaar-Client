import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home/Home";
import Meals from "./pages/Meals/Meals";
import MealDetails from "./pages/MealDetails/MealDetails";
import Order from "./pages/Order/Order";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ErrorPage from "./pages/ErrorPage";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import ChefRoute from "./routes/ChefRoute";
import MyProfile from "./pages/Dashboard/User/MyProfile";
import MyOrders from "./pages/Dashboard/User/MyOrders";
import MyReviews from "./pages/Dashboard/User/MyReviews";
import FavoriteMeals from "./pages/Dashboard/User/FavoriteMeals";
import CreateMeal from "./pages/Dashboard/Chef/CreateMeal";
import MyMeals from "./pages/Dashboard/Chef/MyMeals";
import OrderRequests from "./pages/Dashboard/Chef/OrderRequests";
import ManageUsers from "./pages/Dashboard/Admin/ManageUsers";
import ManageRequests from "./pages/Dashboard/Admin/ManageRequests";
import PlatformStats from "./pages/Dashboard/Admin/PlatformStats";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/meals", element: <Meals /> },
      {
        path: "/meals/:id",
        element: <PrivateRoute><MealDetails /></PrivateRoute>,
      },
      {
        path: "/order/:id",
        element: <PrivateRoute><Order /></PrivateRoute>,
      },
      {
        path: "/payment-success",
        element: <PrivateRoute><PaymentSuccess /></PrivateRoute>,
      },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      // User routes
      { path: "profile", element: <MyProfile /> },
      { path: "my-orders", element: <MyOrders /> },
      { path: "my-reviews", element: <MyReviews /> },
      { path: "favorites", element: <FavoriteMeals /> },
      // Chef routes
      {
        path: "create-meal",
        element: <ChefRoute><CreateMeal /></ChefRoute>,
      },
      {
        path: "my-meals",
        element: <ChefRoute><MyMeals /></ChefRoute>,
      },
      {
        path: "order-requests",
        element: <ChefRoute><OrderRequests /></ChefRoute>,
      },
      // Admin routes
      {
        path: "manage-users",
        element: <AdminRoute><ManageUsers /></AdminRoute>,
      },
      {
        path: "manage-requests",
        element: <AdminRoute><ManageRequests /></AdminRoute>,
      },
      {
        path: "platform-stats",
        element: <AdminRoute><PlatformStats /></AdminRoute>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;