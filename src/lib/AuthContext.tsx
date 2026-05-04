import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  role: 'student' | 'admin' | null;
  profile: any | null;
  loading: boolean;
  signInWithGoogle: (extraData?: any) => Promise<{ isNewUser: boolean }>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, extraData: any) => Promise<void>;
  updateProfile: (newData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'student' | 'admin' | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role as 'student' | 'admin');
            setProfile(data);
          } else {
            setRole(null);
            setProfile(null);
          }
        } catch (error) {
          console.error("Error fetching user role", error);
          setRole(null);
          setProfile(null);
        }
      } else {
        setRole(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (extraData?: any) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // If we have extraData (from signup), create the profile
        if (extraData && (extraData.name || extraData.phone || extraData.school)) {
          const newProfile = {
            email: result.user.email || '',
            role: 'student',
            createdAt: Date.now(),
            name: result.user.displayName || extraData?.name || '',
            ...extraData
          };
          await setDoc(userRef, newProfile);
          setRole('student');
          setProfile(newProfile);
          return { isNewUser: false };
        } else {
          // No profile and no extra data provided - signal UI to redirect to signup
          setRole(null);
          setProfile(null);
          return { isNewUser: true };
        }
      } else {
        const data = userSnap.data();
        setRole(data.role as 'student' | 'admin');
        setProfile(data);
        return { isNewUser: false };
      }
    } catch (error) {
      console.error("Google Signin Error", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, extraData: any) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile = {
        email: result.user.email || '',
        role: 'student',
        createdAt: Date.now(),
        ...extraData
      };
      await setDoc(doc(db, 'users', result.user.uid), newProfile);
      setRole('student');
      setProfile(newProfile);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (newData: any) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData = { ...newData, updatedAt: Date.now() };
      await setDoc(userRef, updateData, { merge: true });
      setProfile((prev: any) => ({ ...prev, ...updateData }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Signout Error", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, profile, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, updateProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

