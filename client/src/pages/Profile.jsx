import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";

import { useDispatch } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [listingData,setListingData] = useState([])

  const { currentUser, loading } = useSelector((state) => state.user);

  const showError = (msg) => {
    toast.error(msg, {
      position: "top-center",
      autoClose: 1500,
    });
  };
  const successfulUpdate = () => {
    toast.success("User Successfully Updated....", {
      position: "top-center",
      autoClose: 1500,
    });
  };

  const handleSubmit = async (e) => {
    dispatch(updateUserStart());
    e.preventDefault();
    try {
      const res = await axios.post(
        `/api/user/update/${currentUser.rest._id}`,
        {
          formData,
        },
        {
          withCredentials: true,
        }
      );
      if (res) {
        successfulUpdate();
        dispatch(updateUserSuccess(res.data));
      } else {
        showError("Error While uploading.....");
        dispatch(updateUserFailure());
      }
    } catch (err) {
      console.log(err);
      showError("Error While uploading.....");
      dispatch(updateUserFailure());
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }  
  
  const handleShowListings = async() =>{
    try{
      setShowListingsError(false);
      const res = await axios.get(
        `/api/user/listings/${currentUser.rest._id}`,
        {
          withCredentials: true
        }
      );
      console.log(res.data);
      if(res){
        setShowListingsError(false);
        setListingData(res.data);
        return ;
      }
      else{
        showError("Erro while fetching the listing data .....")
      }

    }catch(err){
      setShowListingsError(true);
    }

  }

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
        console.log(filePer);
      },
      (error) => {
        console.log(error);
        showError("Error while uploading");
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(
        `/api/user/delete/${currentUser.rest._id}`,{
          withCredentials: true
        }
      );
      if(!res){
        dispatch(deleteUserFailure());
      }
      dispatch(deleteUserSuccess());
    } catch (err) {
      console.log(err);
      dispatch(deleteUserFailure());
    }
  };

  const handleSignout = async () =>{
    try{
      dispatch(signOutUserStart());
      const res = await axios.get("/api/auth/signout",{
        withCredentials:true
      })
      if(!res){
        dispatch(signOutUserFailure());
        return ;        
      }
      dispatch(signOutUserSuccess());
    }catch(err){
      dispatch(signOutUserFailure());
      console.log(err);
    }
  }

  const handleListingDelete = async(listingId) =>{
    try{
      const res = await axios.delete(`/api/listing/delete/${listingId}`,{
        withCredentials:true
      })
      if(res){
        console.log(res.data);
        setListingData(prev => prev.filter((e) => e._id!==listingId))
        console.log(listingData)
      }
    }catch(err){
      console.log(err);
      showError("Error while deleting the listing...")
    }
  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        ></input>
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.rest.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePer}%`}</span>
          ) : filePer === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          onChange={handleChange}
          placeholder="username"
          defaultValue={currentUser.rest.username}
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          onChange={handleChange}
          placeholder="email"
          id="email"
          defaultValue={currentUser.rest.email}
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          onChange={handleChange}
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        {}
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "UPDATE"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <ToastContainer />
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {listingData && listingData.length > 0 && (
      <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold">
          Your Listings
        </h1>
        {listingData.map((listing) => (
          <div
            key={listing._id}
            className="border rounded-lg p-3 flex justify-between items-center gap-4"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-16 w-16 object-contain"
              />
            </Link>
            <Link
              className="text-slate-700 font-semibold  hover:underline truncate flex-1"
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>

            <div className="flex flex-col item-center">
              <button
                onClick={() => handleListingDelete(listing._id)}
                className="text-red-700 uppercase"
              >
                Delete
              </button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase">Edit</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default Profile;
