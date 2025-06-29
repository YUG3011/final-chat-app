import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { RiLogoutCircleLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import userConvorsation from "../../Zustand/useConvorsation";
import { usesocketContext } from "../../context/SocketContext";

export const SideMessageBar = () => {
  const { authUser, setauthUser } = useAuth();
  const { OnlineUser, Socket } = usesocketContext();
  const navigate = useNavigate();
  const [searchInput, setsearchInput] = useState("");
  const [loading, setloading] = useState(false);
  const [chatUser, setchatUser] = useState([]);
  const [selectedUserId, setselectedUserId] = useState(null);
  const [searchUser, setsearchUser] = useState([]);
  const { setSelectedConversation, messages, setMessage } = userConvorsation();
  const [newMessageUsers, setnewMessageUsers] = useState("");
  const isUserOnline = (userId) => OnlineUser.includes(userId);

  useEffect(() => {
    if (!Socket) return;

    const handleNewMessage = (newMessage) => {
      console.log("Incoming message for badge check:", newMessage);
      setnewMessageUsers(newMessage);
     const allUsers = [...chatUser, ...searchUser];
    const sender = allUsers.find(u => u._id === newMessage.senderId);

    if (sender) {
      toast.success(`${sender.username} sent you a message`);
    } else {
      toast.success("You received a new message");
    }
    };

    Socket.on("newMessage", handleNewMessage);

    return () => {
      Socket.off("newMessage", handleNewMessage);
    };
  }, [Socket]);

  useEffect(() => {
    const chatUserHandle = async () => {
      setloading(true);
      try {
        const res = await axios.get("/api/user/currentchatters");
        if (res.data?.success !== false) setchatUser(res.data);
      } catch (error) {
        console.error(error);
      }
      setloading(false);
    };
    chatUserHandle();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const res = await axios.get(`/api/user/search?search=${searchInput}`);
      if (res.data.success === false) {
        toast.info("User not found.");
      } else {
        setsearchUser(res.data);
      }
    } catch (error) {
      console.error(error);
    }
    setloading(false);
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;

    try {
      const a = prompt("enter username");
      if (a === authUser?.username) {
        console.log("yes");
        setloading(true);
        const res = await axios.post("http://localhost:3000/api/auth/logout");
        if (res.data.success !== false) {
          toast.info(res.data.message);
          localStorage.removeItem("chatapp");
          setauthUser(null);
          navigate("/login");
          toast.success("log out succesfully")
        }
      } else {
        toast.error("invalid username");
      }
    } catch (error) {
      console.error(error);
    }
    setloading(false);
  };

  const handleClick = (user) => {
    setSelectedConversation(user);
    setselectedUserId(user._id);
    setnewMessageUsers("");
  };

  const handlebackSearch = () => {
    setSelectedConversation(null);
    setsearchUser([]);
    setsearchInput("");
  };

  return (
    <div className="p-2 w-full md:max-w-[380px] opacity-90 bg-black  text-white ">
      {/* Top bar */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2">
        <IoMdArrowRoundBack
          onClick={handlebackSearch}
          className="h-8 w-8 bg-black text-white hover:bg-white hover:text-black rounded-full cursor-pointer"
        />
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 flex-grow"
        >
          <input
            value={searchInput}
            onChange={(e) => setsearchInput(e.target.value)}
            type="text"
            placeholder="Search chats"
            className="border-2 border-white rounded-full px-3 py-2 w-full text-white"
          />
          <button
            type="submit"
            className="bg-white text-black p-2 rounded-full hover:bg-amber-400"
          >
            <FaSearch />
          </button>
        </form>

        <div className="flex gap-2 items-center">
          <VscAccount
            onClick={() => navigate(`/profile/${authUser?._id}`)}
            className="h-8 w-8 hover:scale-110 hover:bg-green-900 rounded-full cursor-pointer"
          />
          <RiLogoutCircleLine
            onClick={handleLogout}
            className="h-8 w-8 hover:scale-110 hover:bg-red-700 rounded-full cursor-pointer"
          />
        </div>
      </div>

      <hr className="my-3 border-gray-600" />

      {/* User List */}
      <div className="space-y-2">
        {(searchUser.length > 0 ? searchUser : chatUser).map((user) => (
          <div key={user._id}>
            <div
              onClick={() => handleClick(user)}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-150 
        hover:bg-blue-900 hover:border-l-2 hover:border-r-2
        ${selectedUserId === user._id ? "bg-blue-800 border-2" : ""}`}
            >
              <div className="relative w-10 h-10">
                <CgProfile className="h-full w-full hover:scale-110 hover:bg-yellow-500 rounded-full" />
                {isUserOnline(user._id) && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-white font-bold truncate">{user.username}</p>

                {newMessageUsers?.receiverId === authUser?._id &&
                  newMessageUsers?.senderId === user._id && (
                    <div className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                      +1
                    </div>
                  )}
              </div>
            </div>
            <hr className="border-gray-600" />
          </div>
        ))}

        {!loading && chatUser.length === 0 && searchUser.length === 0 && (
          <div className="text-center mt-4 text-gray-300">
            No chats found. Add a friend to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};
