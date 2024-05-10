import { useState, useRef } from "react";
import axios from "axios";
import { useUser } from "../../context/AuthContext";
import { CiImageOn } from "react-icons/ci";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const PostBox = () => {
  const [text, setText] = useState("");
  const [imageBase64, setImageBase64] = useState(null); // To hold base64-encoded image
  const [imagePreview, setImagePreview] = useState(null); // To hold base64-encoded image
  const { user } = useUser(); // Get current user information
  const imageRef = useRef(null);

  // Handle image selection and convert to base64
  const handleImageUpload = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const base64 = await toBase64(file);
      setImageBase64(base64); // Store base64-encoded image
      setImagePreview(
        <img src={base64} alt="Preview" className="max-h-[30rem]" />
      );
    }
  };

  // Handle post submission
  const handlePostSubmit = async () => {
    if (!text || !user || !user._id) {
      console.warn("Required fields are missing");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");

      const postData = {
        text, // Post text
        postedBy: user._id, // User ID
        imageUrl: imageBase64, // Base64-encoded image
      };

      const response = await axios.post(
        "http://localhost:3000/api/posts/create",
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token for authorization
            "Content-Type": "application/json", // Sending JSON data
          },
        }
      );

      console.log("Post created successfully:", response.data);
      console.log(response.data);
      setText("");
      setImageBase64(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="bg-slate-50 h-screen pt-7">
      <div className=" card w-full max-w-3xl bg-base-100 shadow-md rounded-md border border-t-2 border-gray-50 ml-[1.5rem] ">
        <div className="card-body p-[1.5rem]">
          <div className="text-xl font-normal mb-4 text-slate-700">
            Create Post
          </div>
          <textarea
            placeholder="What's on your mind?"
            className="w-full min-h-[20rem] resize-none border border-slate-200 rounded-md outline-none px-3 py-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="card-actions items-center gap-10 mt-4">
            <div
              className="flex gap-1 cursor-pointer"
              onClick={() => imageRef.current.click()}
            >
              <CiImageOn className="text-2xl" />
              Image
            </div>
            <input
              type="file"
              ref={imageRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />
            <button
              className="ml-auto p-2 bg-violet-600 text-white rounded-lg px-5 py-2"
              onClick={handlePostSubmit}
            >
              Share
            </button>
          </div>
          {imagePreview && (
            <div className="mt-4 w-[90%] h-full">{imagePreview}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostBox;
