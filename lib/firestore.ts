import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface JournalEntry {
  id?: string;
  userId: string;
  text: string;
  timestamp: Timestamp;
  aiResponse?: string;
  mood?: number; // 1-5 scale (1 = very sad, 5 = very happy)
}

export const saveJournalEntry = async (userId: string, text: string, mood?: number, aiResponse?: string): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'entries'), {
      userId,
      text,
      timestamp: Timestamp.now(),
      ...(mood && { mood }),
      ...(aiResponse && { aiResponse }),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving journal entry:', error);
    return null;
  }
};

export const updateJournalEntryWithAI = async (entryId: string, aiResponse: string): Promise<boolean> => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const entryRef = doc(db, 'entries', entryId);
    await updateDoc(entryRef, { aiResponse });
    return true;
  } catch (error) {
    console.error('Error updating journal entry with AI response:', error);
    return false;
  }
};

export const getUserJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  try {
    const q = query(
      collection(db, "entries"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    let entries: JournalEntry[] = [];

    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data(),
      } as JournalEntry);
    });

    // Sort client-side by timestamp desc
    entries.sort((a, b) => (b.timestamp as any) - (a.timestamp as any));

    return entries;
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return [];
  }
};
