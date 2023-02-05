import { Timestamp } from '@angular/fire/firestore';

export class Entry {
  id: string;
  timestamp: Date;
  title: string;
  content: string;

  constructor(params: {
    id: string;
    timestamp: Date;
    title: string;
    content: string;
  }) {
    Object.assign(this, params);
  }

  //   SECTION serialization
  static deserialize(json: EntrySerialized): Entry {
    return new Entry({
      id: json.id,
      timestamp: json.timestamp.toDate(),
      title: json.title,
      content: json.content,
    });
  }
  //   !SECTION
}

export type EntrySerialized = {
  id: string;
  timestamp: Timestamp;
  title: string;
  content: string;
};
