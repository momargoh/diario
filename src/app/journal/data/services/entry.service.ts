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
import { Observable, map } from 'rxjs';
import { Entry, EntrySerialized } from '../models/entry';
import { Edit, EditSerialized } from '../models/edit';

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

  getEntry(id: string): Observable<Entry> {
    const entryRef = doc(this.firestore, `entries/${id}`);
    return docData(entryRef).pipe(
      map((json) => Entry.deserialize(json as EntrySerialized))
    );
  }

  deleteEntry(entry: Entry) {
    const entryRef = doc(this.firestore, `entries/${entry.id}`);
    return Promise.all([
      ...entry.editIds?.map((id) =>
        deleteDoc(doc(this.firestore, `edits/${id}`))
      ),
    ]).then(() => {
      return deleteDoc(entryRef);
    });
  }

  getEdit(id: string): Observable<Edit> {
    const editRef = doc(this.firestore, `edits/${id}`);
    return docData(editRef).pipe(
      map((json) => Edit.deserialize(json as EditSerialized))
    );
  }
}
