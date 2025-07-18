// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// const ApiKey = process.env.NEXT_PUBLIC_API_KEY

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDEVdtAWCNSPCBKZjCl9Dm8Qe6Xa-VyzBc',
    authDomain: 'group-watchlist.firebaseapp.com',
    projectId: 'group-watchlist',
    storageBucket: 'group-watchlist.firebasestorage.app',
    messagingSenderId: '87325209889',
    appId: '1:87325209889:web:c2d1869d249fc4cc95ba60',
    measurementId: 'G-GC4CR6MJ55',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
if (process.env.NODE_ENV === 'development') {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099'); // optional if you're testing auth
}

export { db, auth };
