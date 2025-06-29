import React from "react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
  const { setauthUser } = useAuth();
  const navigate = useNavigate();
  const [userInput, setuserInput] = useState({});
  const [loading, setLoading] = useState(false);
  const [inputData, setinputData] = useState({});

  const selectGender = (e) => {
    const updatedGender = e === inputData.gender ? "" : e;
    setinputData((prev) => ({ ...prev, gender: updatedGender }));
    setuserInput((prev) => ({ ...prev, gender: updatedGender }));
  };

  // ✅ Updates both inputData and userInput when typing in fields
  const handleInput = (e) => {
    const { id, value } = e.target;
    setinputData((prev) => ({ ...prev, [id]: value }));
    setuserInput((prev) => ({ ...prev, [id]: value }));
  };
  console.log(userInput);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    //  Confirm password check using inputData (as requested)
    if (inputData.password !== inputData.confirmpassword) {
      setLoading(false);
      return toast.error("Passwords do not match");
    }

    try {
      const register = await axios.post(
        "http://localhost:3000/api/auth/register",
        userInput,
        { withCredentials: true }
      );

      const data = register.data;
      if (!data.success) {
        setLoading(false);
        return toast.error(data.msg || "Registration failed");
      }

      toast.success(data.msg || "registered success");
      localStorage.setItem("chatapp", JSON.stringify(data));
      setauthUser(data);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error(error.response?.data?.msg || "Failed to register");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div
          id="abcs"
          className="w-full sm:w-[80%] md:w-[60%] lg:w-[45%] xl:w-[35%] h-auto bg-black text-white rounded-4xl border-4 opacity-75 font-bold font-serif flex flex-col justify-center items-center py-10"
        >
          <label id="font-style" className="p-5 text-2xl">
            REGISTER
          </label>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center w-full px-4"
          >
            <input
              required
              id="fullname"
              type="text"
              onChange={handleInput}
              placeholder="ENTER FULLNAME"
              className="w-full max-w-[400px] h-[50px] px-4 py-3 rounded-full border-2 border-white-500 focus:outline-none mb-6 placeholder-black"
            />
            <input
              required
              id="username"
              type="text"
              onChange={handleInput}
              placeholder="ENTER USERNAME"
              className="w-full max-w-[400px] h-[50px] px-4 py-3 rounded-3xl border-2 border-white-500 focus:outline-none mb-6 placeholder-black"
            />
            <input
              required
              id="email"
              type="email"
              onChange={handleInput}
              placeholder="ENTER EMAIL"
              className="w-full max-w-[400px] h-[50px] px-4 py-3 rounded-3xl border-2 border-white-500 focus:outline-none mb-6 text-white placeholder-black"
            />
            <input
              required
              id="password"
              type="password"
              onChange={handleInput}
              placeholder="ENTER PASSWORD"
              className="w-full max-w-[400px] h-[50px] px-4 py-3 rounded-3xl border-2 border-white-500 focus:outline-none mb-6 placeholder-black"
            />
            <input
              required
              id="confirmpassword"
              type="password"
              onChange={handleInput}
              placeholder="ENTER CONFIRM PASSWORD"
              className="w-full max-w-[400px] h-[50px] px-4 py-3 rounded-3xl border-2 border-white-500 focus:outline-none mb-4 placeholder-black"
            />

            <div id="gender" className="mt-3 mb-4">
              <label className="cursor-pointer label flex gap-4 text-sm text-gray-200">
                <input
                  onChange={() => selectGender("male")}
                  checked={inputData.gender === "male"}
                  type="checkbox"
                  className="checkbox"
                />
                MALE
                <input
                  onChange={() => selectGender("female")}
                  checked={inputData.gender === "female"}
                  type="checkbox"
                  className="checkbox"
                />
                FEMALE
              </label>
            </div>

            <button
              type="submit"
              className="bg-black rounded-[20px] w-[100px] h-[40px] text-white hover:bg-[#81ffa9] hover:text-black mt-4 border border-black"
            >
              {loading ? "loading..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-5">
            <label className="text-black">Already have an account?</label>
            <Link to={"/login"}>
              <h6 className="text-blue-950 cursor-pointer text-sm">login</h6>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
