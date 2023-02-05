import { Injectable } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, firstValueFrom, map } from 'rxjs';
import { Entry, EntrySerialized } from '../models/entry';
export type CreateEntryParams = { title: string; content: string };

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  constructor(private firestore: Firestore) {}

  listEntries(): Observable<Entry[]> {
    const entriesRef = collection(this.firestore, 'entries');
    return collectionData(entriesRef, { idField: 'id' }).pipe(
      map((res) => {
        return res.map((r) => Entry.deserialize(r as EntrySerialized));
      })
    );
  }

  listEdits(id: string): Observable<Entry[]> {
    const editsRef = collection(this.firestore, `entries/${id}/edits`);
    return collectionData(editsRef, { idField: 'id' }).pipe(
      map((res) => {
        return res.map((r) => Entry.deserialize(r as EntrySerialized));
      })
    );
  }

  getEntry(id: string): Observable<Entry> {
    const entryRef = doc(this.firestore, `entries/${id}`);
    return docData(entryRef).pipe(
      map((json) => Entry.deserialize(json as EntrySerialized))
    );
  }

  createEntry(
    params: CreateEntryParams
  ): Promise<DocumentReference<DocumentData>> {
    const payload = { ...params, timestamp: Timestamp.now() };
    const entriesRef = collection(this.firestore, 'entries');
    return addDoc(entriesRef, payload);
  }

  async updateEntry(id: string, params: CreateEntryParams): Promise<any> {
    // the logic here is to copy the current state of the Entry to the `edits` subcollection
    // then update the original Entry, so that the Entry is always the most recent version
    const originalEntry = await firstValueFrom(this.getEntry(id));
    await addDoc(collection(this.firestore, `entries/${id}/edits`), {
      timestamp: Timestamp.fromDate(originalEntry.timestamp),
      content: originalEntry.content,
      title: originalEntry.title,
    });
    return updateDoc(doc(this.firestore, `entries/${id}`), {
      ...params,
      timestamp: Timestamp.now(),
    });
  }

  async deleteEntry(id: string): Promise<any> {
    // delete all edits first, wait until this is done and then delete the original Entry document
    const edits = await firstValueFrom(
      collectionData(collection(this.firestore, `entries/${id}/edits`), {
        idField: 'id',
      })
    );

    edits.forEach(async (edit) => {
      await deleteDoc(
        doc(
          this.firestore,
          `entries/${id}/edits/${(edit as unknown as { id: string }).id}`
        )
      );
    });
    return deleteDoc(doc(this.firestore, `entries/${id}`));
  }
}
