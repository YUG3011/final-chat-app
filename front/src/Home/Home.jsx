import React from "react";
import { useAuth } from "../context/AuthContext";
import { SideMessageBar } from "./components/SideMessageBar";
import { MessageContainer } from "./components/MessageContainer";
export const Home = () => {
  const { authUser } = useAuth();

  return (
    <>
      <div
        className="
        flex flex-row h-screen w-full"
      >
        <div className="border-8 border-white p-3 w-[33%] h-[100vh] overflow-auto">
          <SideMessageBar />
        </div>
        <div className="w-[65vw] border-l-4">
          <MessageContainer />
        </div>
        
      </div>
    </>
  );
};
  