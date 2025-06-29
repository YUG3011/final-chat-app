import React from "react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export const Log = () => {
  const { setauthUser } = useAuth();

  const navigate = useNavigate();
  const [userInput, setuserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setuserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await axios.post(
        "http://localhost:3000/api/auth/login",
        userInput,
        { withCredentials: true }
      );

      const data = login.data;
      if (data.success === false) {
        setLoading(false);
        return;
      }

      toast.success(data.message || "login success");
      localStorage.setItem("chatapp", JSON.stringify(data));
      setauthUser(data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message ||
          "please enter valid email or password"
      );
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div
          id="abcs"
          className="w-full sm:w-[80%] md:w-[60%] lg:w-[40%] h-auto bg-black text-white rounded-4xl border-4 opacity-75 font-bold font-serif flex flex-col justify-center items-center py-10"
        >
          <label id="font-style" className="p-5 text-2xl">
            Login
          </label>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center w-full px-4"
          >
            <input
              required
              id="email"
              type="email"
              onChange={handleInput}
              placeholder="ENTER EMAIL"
              className="w-full max-w-[400px] h-[50px] mb-6 px-6 py-3 rounded-3xl border-2 border-white focus:outline-none text-white placeholder-black"
            />
            <input
              required
              id="password"
              type="password"
              onChange={handleInput}
              placeholder="ENTER PASSWORD"
              className="w-full max-w-[400px] h-[50px] px-6 py-3 rounded-3xl border-2 border-white focus:outline-none mb-6 placeholder-black"
            />
            <div className="inline-flex items-center text-black mb-4">
              <input type="checkbox" className="m-2" /> I AM 18 YEARS OLD
            </div>

            <button
              type="submit"
              className="bg-black rounded-[20px] w-[100px] h-[40px] text-white hover:bg-[#81ffa9] hover:text-black mt-[10px] border border-black"
            >
              {loading ? "loading..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-5">
            <label className="text-black">Don't have an account?</label>
            <Link to={"/register"}>
              <h6 className="text-blue-950 cursor-pointer text-sm">Register</h6>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
