import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/AuthContext";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

function ChatBox({ chat, currentUserId, setSendMessage, receiveMessage }) {
  const { user } = useUser();
  const [userData, setUserData] = useState(null); // opposite user
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();
  // console.log(chat);
  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
      console.log("object");
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  useEffect(() => {
    console.log([chat]);
    const userId = chat?.members?.find((id) => id !== currentUserId);
    const getUserData = async (req, res) => {
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      // console.log(data);
      setUserData(data);
    };
    if (chat !== null) {
      getUserData();
    }
  }, [chat, currentUserId, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!chat) return; // Ensure `chat` exists
        const response = await fetch(
          `http://localhost:3000/api/message/${chat._id}`, // Use `chat._id` to fetch messages for this chat
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [chat, messages, receiveMessage]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUserId,
      text: newMessage,
      chatId: chat._id,
    };

    try {
      const { data } = await fetch("http://localhost:3000/api/message/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(message),
      });
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
    // SOCKET
    const receiverId = chat.members.find((id) => id !== currentUserId);
    setSendMessage({ ...message, receiverId });
  };
  useEffect(() => {
    if (scroll.current) {
      // console.log("object");
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>
      <div className="rounded-full flex gap-5 items-center px-10 pt-5">
        <img
          src={userData?.profilePic}
          alt="Pic"
          className="rounded-full bg-gray-700 w-14 h-14"
        />
        <div>
          <div className="text-lg font-semibold">{userData?.name}</div>
          <div className="text-sm">Online</div>
        </div>
      </div>
      <div className="divider px-5 m-1"></div>
      <div>
        <div style={{ height: "400px", overflowY: "auto" }}>
          {messages.map((message, index) => (
            <div
              key={index}
              ref={index === messages.length - 1 ? scroll : null}
            >
              <div
                className={
                  message?.senderId === currentUserId
                    ? "chat chat-end"
                    : "chat chat-start"
                }
              >
                <br />
                <span className="chat-bubble">{message?.text}</span>
                <br />
                <span className="text-xs opacity-50">
                  {format(message?.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5">
        <InputEmoji value={newMessage} onChange={handleChange} />
      </div>
      <div onClick={handleSend}>Send</div>
    </div>
  );
}

export default ChatBox;
