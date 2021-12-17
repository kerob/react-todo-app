import React, { useState, createContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "@firebase/auth";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [user, setUser] = useState({});
  const [authMessage, setAuthMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          id: user.uid,
          email: user.email,
        });
        //navigate(`/${user.uid}/boards`);
      } else {
        setUser({});
      }
    });
  }, []);

  // const navigateCallback = useCallback(() => {
  //   navigate(`/${user.id}/boards`);
  // }, [navigate, user.id]);

  // useEffect(() => {
  //   if (user.id) {
  //     navigate(`/${user.id}/boards`);
  //   }
  // }, [user.id]);

  const signUp = async (email, password, e) => {
    try {
      e.preventDefault();
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const logIn = async (email, password, e) => {
    try {
      e.preventDefault();
      await signInWithEmailAndPassword(auth, email, password);
      console.log("logged in");
      // if (user.id) {
      //navigate(`/${user?.id}/boards`);
      // }
      //navigateCallback();
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const logOut = () => {
    try {
      signOut(auth);
      setUser({});
      navigate("/");
      console.log("signed out");
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, authMessage, signUp, logIn, logOut }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
