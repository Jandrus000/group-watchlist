import {useEffect, useState} from 'react'
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {auth} from '../firebase/firebase'
import { addUser, addUserGoogle } from './firestore';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return {user,loading}
}

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        addUserGoogle(user.displayName, user.uid)
        
    } catch (error) {
        console.error(`Google sign-in error:`, error)
    }
}

export const logout = async () => {
    try {
        await signOut(auth);
    } catch(error) {
        console.error(`Logout Error: ${error}`)
    }
}

export async function signUp(email: string, password: string, username: string) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile( userCredential.user, {
            displayName: username
        })
        addUser(username,userCredential.user.uid)
        return userCredential.user
    } catch (error) {
        return error
    }
}

export async function logIn(email: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Firebase logIn error:", error);
        throw error;
    }
}

// implement deleting account and changing username