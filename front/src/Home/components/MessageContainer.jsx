import React, { useRef, useEffect, useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { BiSend } from "react-icons/bi";
import { LuMessageCircle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userConvorsation from "../../Zustand/useConvorsation";
import { useAuth } from "../../context/AuthContext";
import notify from "../../assets/sound/new-message-2-125765.mp3";
import { usesocketContext } from "../../context/SocketContext";

export const MessageContainer = () => {
  const { messages = [], selectedConversation, setMessage } = userConvorsation();
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const { Socket } = usesocketContext();

  const [loading, setLoading] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef(null);

  // Real-time listener
  useEffect(() => {
    if (!Socket) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.senderId !== authUser._id) {
        const sound = new Audio(notify);
        sound.play().catch((err) => console.warn("Audio play blocked:", err));
      }

      setMessage((prev) => [...prev, newMessage]);
    };

    Socket.on("newMessage", handleNewMessage);

    return () => {
      Socket.off("newMessage", handleNewMessage);
    };
  }, [Socket, authUser._id, setMessage]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedConversation?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/message/${selectedConversation._id}`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        setMessage(res.data.messages);
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedConversation?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sendData.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/api/message/send/${selectedConversation._id}`,
        {
          message: sendData,
          receiverId: selectedConversation._id,
        },
        {
          withCredentials: true,
        }
      );

      const newMessage = response.data.data;

      setMessage((prevMessages) => [...prevMessages, newMessage]);
      setSendData("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <>
      {!selectedConversation ? (
        <div className="flex justify-center items-center m-auto h-[585px] bg-black">
          <div className="text-white">
            <p>
              👋WELCOME <b>"{authUser.username}"</b>👋
            </p>
            <p>FIND FRIEND AND START CHAT 📄📄</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-screen max-h-screen">
          {/* Header */}
          <div className="bg-white text-white text-center border-4 border-black flex rounded-2xl items-center h-[60px]">
            <div className="ml-2 flex items-center">
              <VscAccount
                onClick={() => navigate(`/profile/${authUser?._id}`)}
                className="h-10 w-10 hover:scale-110 rounded-full border-2 border-black hover:bg-green-900 cursor-pointer bg-black mr-3"
              />
              <span className="text-black">
                {selectedConversation?.username}
              </span>
            </div>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto px-2">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                <div className="loading loading-spinner"></div>
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div className="flex justify-center items-center m-auto border-2 border-white bg-black">
                <span className="text-white">SEND MESSAGE TO START CONVERSATION </span>
                <LuMessageCircle size={40} className=" text-white" />
                <LuMessageCircle size={40} className=" text-white" />
              </div>
            )}

            {!loading &&
              messages.map((message, index) => (
                <div key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
                  <div
                    className={`chat ${
                      message.senderId === authUser._id ? "chat-end" : "chat-start"
                    }`}
                  >
                    <div className="text-[10px] opacity-70 text-white font-bold">
                      {new Date(message?.createdAt).toLocaleDateString("en-IN")}
                    </div>
                    <div
                      className={`relative p-3 rounded-lg max-w-[40%] mt-2 ${
                        message.senderId === authUser._id
                          ? "bg-blue-600 text-white ml-auto mr-2 before:content-[''] before:absolute before:bottom-0 before:right-[-8px] before:border-[10px] before:border-transparent before:border-t-green-700 before:border-b-0 before:border-l-0 before:mb-[-10px]"
                          : "bg-green-700 text-black ml-2 before:content-[''] before:absolute before:bottom-0 before:left-[-8px] before:border-[10px] before:border-transparent before:border-t-blue-600 before:border-b-0 before:border-r-0 before:mb-[-10px]"
                      }`}
                    >
                      {message?.message}
                      <div className="flex justify-end text-[10px] text-black">
                        <b>
                          {new Date(message?.createdAt).toLocaleTimeString("en-IN", {
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </b>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Bottom input bar */}
          <form onSubmit={handleSubmit}>
            <div className="w-full bg-white text-center py-2 items-start flex pl-2 border-black border-l-4 border-r-4 border-b-6">
              <input
                value={sendData}
                onChange={(e) => setSendData(e.target.value)}
                type="text"
                placeholder="Type a Message"
                className="border-4 border-black text-black rounded-full p-2.5 w-[90%]"
              />
              <button type="submit">
                <BiSend className="h-12 w-12 hover:scale-110 rounded-full border-8 border-black hover:bg-blue-900 cursor-pointer bg-black ml-1 text-white" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
