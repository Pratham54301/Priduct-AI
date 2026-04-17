import { db } from '@/lib/firebase';
import { Schedule } from '@/models/types';
import { collection, addDoc, getDocs } from 'firebase/firestore';

/**
 * Adds a new schedule to the Firestore 'schedules' collection.
 * @param scheduleData - The schedule data to add, without the 'id'.
 * @returns The ID of the newly created schedule document.
 */
export async function addSchedule(scheduleData: Omit<Schedule, 'id'>): Promise<string> {
    if (!db) throw new Error("Firebase is not initialized.");
    const schedulesCollection = collection(db, 'schedules');
    const docRef = await addDoc(schedulesCollection, scheduleData);
    return docRef.id;
}

/**
 * Fetches all schedules from the Firestore 'schedules' collection.
 * @returns An array of schedule objects.
 */
export async function getSchedules(): Promise<Schedule[]> {
    if (!db) throw new Error("Firebase is not initialized.");
    const schedulesCollection = collection(db, 'schedules');
    const snapshot = await getDocs(schedulesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Schedule));
}
