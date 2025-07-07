
'use server';

import { db } from '@/lib/firebase';
import { User } from '@/models/types';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const usersCollection = collection(db, 'users');

/**
 * Adds a new user to the Firestore 'users' collection.
 * @param userData - The user data to add, without the 'id'.
 * @returns The ID of the newly created user document.
 */
export async function addUser(userData: Omit<User, 'id'>): Promise<string> {
  if (!db) throw new Error("Firebase is not initialized.");
  const docRef = await addDoc(usersCollection, userData);
  return docRef.id;
}

/**
 * Fetches all users from the Firestore 'users' collection.
 * @returns An array of user objects.
 */
export async function getUsers(): Promise<User[]> {
  if (!db) throw new Error("Firebase is not initialized.");
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

/**
 * Updates a user's role in Firestore.
 * @param userId - The ID of the user to update.
 * @param role - The new role to assign.
 */
export async function updateUserRole(userId: string, role: 'User' | 'Admin'): Promise<void> {
    if (!db) throw new Error("Firebase is not initialized.");
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, { role });
}

/**
 * Deletes a user from the Firestore 'users' collection.
 * @param userId - The ID of the user to delete.
 */
export async function deleteUser(userId: string): Promise<void> {
    if (!db) throw new Error("Firebase is not initialized.");
    const userDoc = doc(db, 'users', userId);
    await deleteDoc(userDoc);
}

/**
 * Finds a user by their email address.
 * @param email - The email of the user to find.
 * @returns The user object or null if not found.
 */
export async function findUserByEmail(email: string): Promise<(User & { id: string }) | null> {
    if (!db) throw new Error("Firebase is not initialized.");
    const q = query(usersCollection, where("email", "==", email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    const userDoc = snapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User & { id: string };
}
