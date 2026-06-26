import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: "AIzaSyAg5OhbKamjtaaOo6klVlEmtzw-Ki2zoSo",
  authDomain: "studio-2316970453-e93e1.firebaseapp.com",
  projectId: "studio-2316970453-e93e1",
  storageBucket: "studio-2316970453-e93e1.firebasestorage.app",
  messagingSenderId: "1011063381973",
  appId: "1:1011063381973:web:0e7aa78b008b44e830e75c"
};

// Check if Firebase app is already initialized to avoid "already exists" error
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistence, handling already-initialized errors
let firebaseAuth;
try {
  firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  firebaseAuth = getAuth(app);
}

export const auth = firebaseAuth;
export const db = getFirestore(app);

export default app;
