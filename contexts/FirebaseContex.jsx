import React, { createContext, useContext, useState, useEffect } from "react";

import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from "firebase/firestore";
import { db } from "./firebase";