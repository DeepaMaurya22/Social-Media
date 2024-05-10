import { useEffect, useState } from "react";
import { useUser } from "../../context/AuthContext";
import Conversation from "../../components/Chat/Conversation";
import ChatBox from "../../components/Chat/ChatBox";
import { io } from "socket.io-client";
import { useRef } from "react";

function Chat() {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [error, setError] = useState(null);
  const socket = useRef();

  const userId = user?._id;

  useEffect(() => {
    socket.current = io("http://localhost:8000"); // Initialize socket connection

    if (userId) {
      socket.current.emit("add-new-user", userId); // Emit the user ID
    }

    const handleGetUsers = (users) => {
      setOnlineUsers(users); // Update state with the list of users
      console.log("onlineUsers", users); // Log received users
      // console.log("onlineUsers", onlineUsers); // Log received users
    };

    socket.current.on("get-users", handleGetUsers); // Set up event listener

    return () => {
      socket.current.off("get-users", handleGetUsers); // Cleanup on unmount
    };
  }, [userId]); //*****************user here */

  const fetchChats = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/chat/${user._id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }

      const data = await response.json();
      console.log("chat");
      console.log(data);
      setChats(data);
    } catch (error) {
      setError(error.message); // Set error state
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchChats(); // Call fetchChats when user is defined
    }
  }, [user]); // Proper dependency on user ID

  // receive from socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      console.log("object");
      console.log("Data received from Parent", data);
      setReceiveMessage(data);
    });
  }, []);

  // sending to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  if (loading) {
    return <div>Loading chats...</div>; // Display loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return (
    <div className="flex min-h-screen bg-slate-50 w-full gap-5">
      <div className="min-w-[20rem] bg-gray-300">
        <div className="text-xl py-5 px-8">Chat</div>
        <div>
          {chats.length === 0 ? (
            <div>No chats available</div> // Empty state handling
          ) : (
            chats.map((chat) => (
              <div key={chat._id}>
                <div key={chat._id} onClick={() => setCurrentChat(chat)}>
                  <Conversation data={chat} currentUserId={user?._id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="bg-gray-200 flex-grow">
        {currentChat ? (
          <ChatBox
            chat={currentChat}
            currentUserId={user?._id}
            setSendMessage={setSendMessage}
            receiveMessage={receiveMessage}
          />
        ) : (
          <div>Select a conversation to start chatting</div> // Default state
        )}
      </div>
    </div>
  );
}

export default Chat;
