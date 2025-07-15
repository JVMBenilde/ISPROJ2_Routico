import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCqSwQxgzSWfd2_DnTpcyREkFMr7--DYEI",
  authDomain: "routico-app.firebaseapp.com",
  projectId: "routico-app",
  storageBucket: "routico-app.firebasestorage.app",
  messagingSenderId: "559840386653",
  appId: "1:559840386653:web:dd6450aada52b586f9f7b4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
