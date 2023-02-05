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
  getDoc,
  orderBy,
} from '@angular/fire/firestore';
import { Observable, combineLatest, from, map, of, switchMap } from 'rxjs';
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

  createEntry(
    params: CreateEntryParams
  ): Promise<DocumentReference<DocumentData>> {
    const payload = { ...params, timestamp: Timestamp.now(), edits: [] };
    const entriesRef = collection(this.firestore, 'entries');
    return addDoc(entriesRef, payload);
  }

  getEntry(id: string): Observable<Entry> {
    const entryRef = doc(this.firestore, `entries/${id}`);
    return docData(entryRef).pipe(
      map((json) => Entry.deserialize(json as EntrySerialized))
    );
  }

  deleteEntry(id: string) {
    // delete all edits first, wait until this is done and then delete the original Entry document
    const editsRef = collection(this.firestore, `entries/${id}/edits`);
    return collectionData(editsRef, { idField: 'id' }).pipe(
      switchMap((res) => {
        if (res.length === 0) {
          return of(true);
        }
        return combineLatest(
          res.map((r) => {
            return from(
              deleteDoc(
                doc(
                  this.firestore,
                  `entries/${id}/edits/${(r as unknown as { id: string }).id}`
                )
              )
            );
          })
        );
      }),
      map((_) => {
        // now delete original Entry
        return from(deleteDoc(doc(this.firestore, `entries/${id}`)));
      })
    );
  }
}
