import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const userCreatedNotify = () => {
    toast.success("User Created Succesfully... SignIn to continue...", {
      position: "top-center",
      autoClose: 1500,
    });
  };
  const singupError = () => {
    toast.error("Try using differnt username and email");
  };
  console.log(formData);
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/signup", {
        formData
      });
      userCreatedNotify();
      setLoading(false);
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
      console.log(res.data);
    } catch (err) {
      singupError();
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading...." : "Sign Up"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/signin"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
