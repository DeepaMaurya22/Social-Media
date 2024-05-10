function Post({ profile }) {
  return (
    <div className="card w-[17rem] bg-base-100 shadow-md m-2">
      <figure>
        <img
          src={
            profile.coverPage ||
            "https://res.cloudinary.com/dnrt42dyu/image/upload/v1714890458/coverImages/f1kyhyghkblg3ggaoagv.jpg"
          }
          alt="Image"
          className="h-[7rem] w-full max-w-md object-cover"
        />
      </figure>
      <img
        src={
          profile.profilePic ||
          "https://res.cloudinary.com/dnrt42dyu/image/upload/v1714890456/profilePics/bruzxwebz2nvve6jhjzn.jpg"
        }
        alt="Image"
        className="w-20 rounded-full top-[4.5rem] left-[6rem] absolute border shadow-md"
      />
      <div className="flex flex-col items-center justify-center mt-12 mb-5">
        <div className="text-lg font-semibold">{profile.username}</div>
        <div className="text-xs">{profile.email}</div>
        <hr className="m-3 bg-black" />
        <div className="flex items-center justify-center gap-2 mb-4 border-y-2 p-3 border-slate-200 w-3/4 mx-2">
          <div className="text-center border-r-2 border-slate-200 pr-5">
            <h3 className="text-md">{profile.follower?.length}</h3>
            <h3 className="text-slate-500 text-sm">Followers</h3>
          </div>
          <div className="text-center pl-4">
            <h3 className="text-md">{profile.following?.length} </h3>
            <h3 className="text-slate-500 text-sm">Following</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
