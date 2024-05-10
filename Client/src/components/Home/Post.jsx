import { LuHeart } from "react-icons/lu";
import { VscSend } from "react-icons/vsc";
import { BsChat } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useUser } from "../../context/AuthContext";
import axios from "axios";

function Post({ post }) {
  // console.log(post);
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [text, setText] = useState("");
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [replyCount, setReplyCount] = useState(post.replies.length);
  const [replies, setReplies] = useState(post.replies);

  useEffect(() => {
    const fetchInitialLikeStatus = () => {
      setIsLiked(post.likes.includes(user._id));
    };

    fetchInitialLikeStatus();
  }, [post, user]);

  const handleLikeUnlike = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const endpoint = `http://localhost:3000/api/posts/like/${post._id}`;

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (isLiked) {
        setIsLiked(false);
        // console.log(isLiked);
        setLikeCount((prev) => prev - 1);
      } else {
        setIsLiked(true);
        // console.log(isLiked);
        setLikeCount((prev) => prev + 1);
      }
      // console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleReply = async () => {
    try {
      const token = localStorage.getItem("jwt"); // JWT token for authorization
      //   console.log("Sending text:", text); // Debug to ensure text is correct

      const response = await fetch(
        `http://localhost:3000/api/posts/reply/${post._id}`, // PUT request to update a reply
        {
          method: "PUT", // Use PUT for updating an existing resource
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token for authorization
            "Content-Type": "application/json", // Set content type to JSON
          },
          body: JSON.stringify({ text }), // Convert text to JSON
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to reply: ${response.statusText}`); // Handle failed requests
      }

      const data = await response.json(); // Extract data from response
      // console.log("Reply updated successfully:", data);

      // Ensure the expected property exists before accessing it
      if (typeof data.updatedReplyCount === "undefined") {
        throw new Error("Reply count not found in the response"); // Handle missing property
      }
      const newReply = data.reply;
      // console.log(newReply);
      setReplies([...replies, newReply]);
      setText("");
      setReplyCount(data.updatedReplyCount);
    } catch (error) {
      console.error("Error updating reply:", error); // Error handling
    }
  };

  return (
    <div
      className="bg-white mt-5 rounded-lg p-4 shadow-md border border-t-2 border-gray-50"
      key={post._id}
    >
      <div className=" flex">
        <div className="avatar mask mask-squircle w-12 h-12 mr-3">
          <img
            src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            alt="Avatar Tailwind CSS Component"
            className="rounded-full"
          />
        </div>
        <div>
          <div className="font-bold text-slate-600">{post.postedBy?.name}</div>
          <div className="text-sm opacity-50">1hr</div>
        </div>
      </div>
      <div className="mx-4">
        <p className="mt-4 leading-tight text-slate-600">{post.text}</p>
        <div className="mt-3">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post image"
              className="h-auto rounded-lg max-h-[30rem]"
            />
          )}
        </div>
        <div className="text-2xl flex gap-5 mt-4 text-slate-600">
          <LuHeart
            onClick={() => handleLikeUnlike()}
            className={`${
              isLiked ? "text-red-500 fill-red-500" : ""
            }  cursor-pointer`}
          />
          <BsChat className="cursor-pointer" />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input input-xs p-0 rounded-none ml-auto max-w-96 w-full border-b-2 border-b-slate-200 outline-none"
          />
          <VscSend className="cursor-pointer" onClick={handleReply} />
        </div>
        <p className="text-xs mt-2 text-slate-600">
          {likeCount || 0} likes - {replyCount || 0} replies
        </p>
        {/* {console.log(replies)} */}
        {replies.length > 0 && (
          <div>
            <div className="flex gap-2 mt-2 items-center">
              <div>
                <img
                  src={replies.userProfilePic}
                  alt={`${replies.userProfilePic} Pic`}
                  className="avatar rounded-full bg-gray-300 w-10 h-10"
                />
              </div>
              <div className="text-md font-semibold">
                {replies[replies.length - 1].username}:
              </div>
              <div>{replies[replies.length - 1].text}</div>
            </div>
          </div>
        )}

        {/* {mostRecentReply ? (
          <div>
            <div className="flex gap-2 mt-2 items-center">
              <div>
                <img
                  src={mostRecentReply.userProfilePic}
                  alt={`Pic`}
                  className="avatar rounded-full bg-gray-300 w-10 h-10"
                />
              </div>
              <div className="text-md font-semibold">
                {mostRecentReply.username}:
              </div>
              <div>{mostRecentReply.text}</div>
            </div>
          </div>
        ) : (
          <p className="text-xs mt-2">No replies yet</p> 
        )} */}
      </div>
    </div>
  );
}

export default Post;
