import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) =>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);

    const searchQuery = urlParams.toString();   

    navigate(`/search?${searchQuery}`)
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search)
    const searchTermFromUrl = urlParams.get('searchTerm');

    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  },[window.location.search])
  return (
    <header className="flex bg-slate-200 justify-around bg-shadow-md items-center h-16">
      <h1 className="text-sm sm:text-3xl font-bold">
        <span className="text-slate-500">Real</span>
        <span className=" text-slate-700">Estate</span>
      </h1>
      <form onSubmit={handleSubmit} className="bg-slate-100 p-1 rounded-md flex items-center ">
        <input
          type="text"
          placeholder="Search..."
          className="border-none focus:outline-none bg-transparent w-24 sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        ></input>
        <button>
          <FaSearch className="text-slate-500" />
        </button>
      </form>
      <ul className="flex gap-3 text-lg">
        <Link to={"/"}>
          <li className="hidden sm:inline text-slate-700 hover:underline">
            Home
          </li>
        </Link>
        <Link to="/about">
          <li className="hidden sm:inline text-slate-700 hover:underline">
            About
          </li>
        </Link>
        <Link to="/profile">
          {currentUser ? (
            <img
              className="rounded-full h-7 w-7 object-cover"
              src={currentUser.rest.avatar}
              alt="Profile"
            />
          ) : (
            <li className="text-slate-700 hover:underline">Signin</li>
          )}
        </Link>
      </ul>
    </header>
  );
};

export default Header;
