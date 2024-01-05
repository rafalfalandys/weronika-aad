import { useState, useEffect } from "react";
import { auth } from "../helper/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

const useFirebase = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user && location.pathname === "/edit-panel") {
        navigate("/");
      }
    });

    return unsubscribe;
  }, []);

  const signInWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      throw error;
    }
  };

  return { user, signInWithEmailAndPassword, signOut };
};

export default useFirebase;
