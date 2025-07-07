
'use server';

import { db } from '@/lib/firebase';
import { LeaderboardEntry } from '@/models/types';
import { collection, getDocs, writeBatch } from 'firebase/firestore';

const leaderboardCollection = collection(db, 'leaderboard');

/**
 * Fetches all entries from the Firestore 'leaderboard' collection.
 * @returns An array of leaderboard entry objects.
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (!db) throw new Error("Firebase is not initialized.");
    const snapshot = await getDocs(leaderboardCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardEntry));
}

/**
 * Resets all scores in the leaderboard to zero.
 * NOTE: This is a destructive operation.
 */
export async function resetAllScores(): Promise<void> {
    if (!db) throw new Error("Firebase is not initialized.");
    const snapshot = await getDocs(leaderboardCollection);
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { score: 0 });
    });
    await batch.commit();
}
