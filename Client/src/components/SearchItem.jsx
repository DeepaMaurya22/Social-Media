import { IoSearch } from "react-icons/io5";

function SearchItem() {
  return (
    <div className="flex gap-3 px-3 pt-4 pb-2 ">
      <div>Social</div>
      <div className="flex justify-center items-center gap-1">
        <input
          type="text"
          placeholder="Type here"
          className="input input-sm bg-slate-100 w-full max-w-xs"
        />
        <IoSearch className="text-xl ml-1" />
      </div>
    </div>
  );
}

export default SearchItem;
