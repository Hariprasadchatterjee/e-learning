import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store/store";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { fetchProfile } from "@/components/store/slice/userSlice";
import GlobalLoader from "../../middleware/GlobalLoader.jsx";

const Root = () => {
  const { isLoggedIn, user, error, message, loading } = useSelector(
    (state: RootState) => state.auth
  );

  console.log("userRole", user?.role);
  
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (message) {
      toast.success(message); // Use toast.success for positive messages
    }
    if (error) {
      toast.error(error); // Use toast.error for errors
    }
  }, [message, error]); // Removed dispatch from dependencies

  useEffect(() => {
   // Only fetch if logged in
      dispatch(fetchProfile())
    
  }, [dispatch]); // Added isLoggedIn to dependencies



  return (
    <>
    {
      loading && <GlobalLoader /> // Show loader if loading is true
    }
      <Header isLogedIn={isLoggedIn} userRole={user?.role} /> {/* Assuming user has a role property */}
      <ToastContainer position="top-right" autoClose={5000} />
      <Outlet />
      <Footer />
    </>
  );
};

export default Root;