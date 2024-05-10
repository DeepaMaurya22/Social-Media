import { MdOutlineEdit } from "react-icons/md";
import { useUser } from "../../context/AuthContext";
import { useRef, useState, useEffect } from "react";

function UserInfo() {
  const { user, setUser } = useUser();

  const [name, setName] = useState(user.name);
  const [liveIn, setLiveIn] = useState("");
  const [workAt, setWorkAt] = useState("");
  const [bio, setBio] = useState("");
  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const userId = user?._id;
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }
    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };
    let profilePicBase64 = null;
    let coverImageBase64 = null;

    if (profileImageRef.current?.files[0]) {
      profilePicBase64 = await convertFileToBase64(
        profileImageRef.current.files[0]
      );
    }

    if (coverImageRef.current?.files[0]) {
      coverImageBase64 = await convertFileToBase64(
        coverImageRef.current.files[0]
      );
    }
    const formData = {
      name,
      liveIn,
      workAt,
      bio,
      profilePic: profilePicBase64,
      coverImage: coverImageBase64,
    };
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      console.log(formData);

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            user.name = formData.name;
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
          } else {
            console.error("No user found in localStorage");
          }
          setName("");
          setLiveIn("");
          setWorkAt("");
          setBio("");
          profileImageRef.current.value = "";
          coverImageRef.current.value = "";
        } else {
          console.error("Expected 'user' in response, but got:", data);
        }
      } else {
        console.error("Error updating user:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  return (
    <>
      <MdOutlineEdit
        className="cursor-pointer"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      />
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box max-w-2xl">
          <form onSubmit={handleUpdate}>
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              ✕
            </button>
            <h3 className="font-semibold text-xl text-center">Your Info</h3>
            <div className="flex ">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-10 ">
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Live in</span>
                </label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  className="input input-bordered w-full"
                  value={liveIn}
                  onChange={(e) => setLiveIn(e.target.value)}
                />
              </div>
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Work at</span>
                </label>
                <input
                  type="text"
                  placeholder="Andheri"
                  className="input input-bordered w-full"
                  value={workAt}
                  onChange={(e) => setWorkAt(e.target.value)}
                />
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Bio:</span>
              </label>
              <textarea
                placeholder="Bio"
                className="textarea textarea-bordered textarea-xs w-full h-24"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>
            <div className="form-control mt-6 flex flex-row justify-between gap-2">
              <div>
                <label className="label">
                  <span className="label-text">Profile Image</span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs"
                  ref={profileImageRef}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Cover Image</span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs"
                  ref={coverImageRef}
                />
              </div>
            </div>
            <div className="form-control mt-6 w-32 0 ml-auto">
              <button
                className="btn bg-violet-800 text-white"
                type="submit"
                onClick={() => document.getElementById("my_modal_3").close()}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default UserInfo;
