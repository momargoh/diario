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
import {
  Observable,
  combineLatest,
  from,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';
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
    const payload = { ...params, timestamp: Timestamp.now() };
    const entriesRef = collection(this.firestore, 'entries');
    return addDoc(entriesRef, payload);
  }

  updateEntry(id: string, params: CreateEntryParams) {
    // the logic here is to copy the current state of the Entry to the `edits` subcollection
    // then update the original Entry, so that the Entry is always the most recent version
    return this.getEntry(id).pipe(
      take(1),
      switchMap((entry) => {
        const editsRef = collection(this.firestore, `entries/${id}/edits`);
        return from(
          addDoc(editsRef, {
            timestamp: Timestamp.fromDate(entry.timestamp),
            content: entry.content,
            title: entry.title,
          })
        );
      }),
      switchMap((res) => {
        const entriesRef = doc(this.firestore, `entries/${id}`);
        return from(
          updateDoc(entriesRef, { ...params, timestamp: Timestamp.now() })
        );
      })
    );
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
        // combineLatest won't emit until all docs in the `edits` subcollection have been deleted
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
