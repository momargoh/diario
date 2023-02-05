import { Injectable } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  orderBy,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
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

  createEntry(
    params: CreateEntryParams
  ): Promise<DocumentReference<DocumentData>> {
    const payload = { ...params, timestamp: Timestamp.now(), edits: [] };
    const entriesRef = collection(this.firestore, 'entries');
    return addDoc(entriesRef, payload);
  }
}
