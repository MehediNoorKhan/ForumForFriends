import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../Firebase/firebase.config.init';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const createUser = (email, password) => {
        setUser(null);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const updateUserProfile = (user, profile) => {
        return updateProfile(user, profile);
    };

    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        setUser(null);
        setLoading(false);
        return signOut(auth);
    };

    const authInfo = {
        user,
        setUser,
        setLoading,
        loading,
        createUser,
        updateUserProfile,
        login,
        logout
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setLoading(false); // stop spinner
        });

        return () => unsubscribe();
    }, []);


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;