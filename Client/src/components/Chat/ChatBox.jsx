import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/AuthContext";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

function ChatBox({ chat, currentUserId, setSendMessage, receiveMessage }) {
  const { user } = useUser();
  const [userData, setUserData] = useState(null); // opposite user
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef(); // This ref will be used to scroll to the latest message
  const [shouldScroll, setShouldScroll] = useState(true);

  // Effect to handle incoming messages via receiveMessage
  useEffect(() => {
    if (receiveMessage && receiveMessage.chatId === chat._id) {
      setMessages((prevMessages) => [...prevMessages, receiveMessage]);
    }
    setShouldScroll(true);
  }, [receiveMessage, chat._id]);

  // Fetch user data and messages for this chat
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = chat?.members?.find((id) => id !== currentUserId);
      if (userId) {
        const response = await fetch(
          `http://localhost:3000/api/users/${userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        setUserData(data);
      }
    };

    const fetchMessages = async () => {
      if (!chat) return;
      const response = await fetch(
        `http://localhost:3000/api/message/${chat._id}`, // Use the chat's ID
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setMessages(data);
      setShouldScroll(true);
    };

    fetchUserData(); // Fetch opposite user data
    fetchMessages(); // Fetch chat messages
  }, [chat, currentUserId]);
  // }, [chat, currentUserId, messages]);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentUserId]); // This effect runs when `messages` change
  useEffect(() => {
    if (shouldScroll && scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" }); // Scroll if `shouldScroll` is `true`
      setShouldScroll(false); // Reset `shouldScroll` to avoid repeated scrolling
    }
  }, [shouldScroll, messages]); // Correct dependency to avoid infinite loop

  const handleSend = async (e) => {
    e.preventDefault();

    const message = {
      senderId: currentUserId,
      text: newMessage,
      chatId: chat._id,
    };

    try {
      const response = await fetch("http://localhost:3000/api/message/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(message),
      });
      const data = await response.json();

      setMessages((prevMessages) => [...prevMessages, data]);
      setNewMessage("");
      setShouldScroll(true);

      // Notify other users of the new message
      const receiverId = chat.members.find((id) => id !== currentUserId);
      setSendMessage({ ...message, receiverId });
      setShouldScroll(true);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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

      <div style={{ height: "400px", overflowY: "auto" }}>
        {messages.map((message, index) => (
          <div key={index} ref={index === messages.length - 1 ? scroll : null}>
            <div
              className={
                message.senderId === currentUserId
                  ? "chat chat-end"
                  : "chat chat-start"
              }
            >
              <span className="chat-bubble">{message.text}</span>
              <span className="text-xs opacity-50">
                {format(message.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-5">
        <InputEmoji value={newMessage} onChange={(e) => setNewMessage(e)} />
      </div>

      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatBox;
