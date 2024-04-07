import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSucess } from "../redux/user/userSlice";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

const OAuth = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();
  const handleGooglClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const res = await axios.post(
        "/api/auth/google",
        {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }
      );
      dispatch(signInSucess(res.data));
      navigate("/")
    } catch (err) {
      console.log("Could not Sign in with google", err);
    }
  };
  return (
    <button
      onClick={handleGooglClick}
      type="button"
      className="bg-green-600 text-white  p-3 rounded-lg uppercase hover:opacity-95"
    >
      OAuth
    </button>
  );
};

export default OAuth;
