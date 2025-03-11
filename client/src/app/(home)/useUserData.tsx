"use client";

import {
  useEffect,
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { ReactNode } from "react";

interface UserData {
  uid: string;
  favourites: string[];
}
interface UserContextType {
  userData: UserData | null;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
}

const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <UserContext.Provider
      value={{ userData: userData, setUserData: setUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const { userData, setUserData } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (curUser) => {
      if (userData?.uid === curUser?.uid) {
        return;
      }
      if (!curUser) {
        setUserData(null);
        return;
      }
      const docRef = doc(db, "users", curUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData({
          uid: curUser.uid,
          favourites: userData.favourites || [],
        });
      } else {
        // If the document doesn't exist, create it with an empty favourites array
        await setDoc(docRef, {
          favourites: [],
        });
        setUserData({
          uid: curUser.uid,
          favourites: [],
        });
      }
    });
    return () => unsubscribe();
  }, [userData, setUserData]);

  const setUserDataAndSync = async (newData: UserData) => {
    if (!userData) return;
    const docRef = doc(db, "users", userData.uid);
    await setDoc(docRef, newData);
    setUserData(newData);
  };

  return { userData, setUserDataAndSync };
}
