
'use server';

import { db } from '@/lib/firebase';
import { Payment } from '@/models/types';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const paymentsCollection = collection(db, 'payments');

/**
 * Adds a new payment record to the Firestore 'payments' collection.
 * @param paymentData - The payment data to add, without the 'id'.
 * @returns The ID of the newly created payment document.
 */
export async function addPayment(paymentData: Omit<Payment, 'id'>): Promise<string> {
    if (!db) throw new Error("Firebase is not initialized.");
    const docRef = await addDoc(paymentsCollection, paymentData);
    return docRef.id;
}

/**
 * Fetches all payments from the Firestore 'payments' collection.
 * @returns An array of payment objects.
 */
export async function getPayments(): Promise<Payment[]> {
    if (!db) throw new Error("Firebase is not initialized.");
    const snapshot = await getDocs(paymentsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
}
