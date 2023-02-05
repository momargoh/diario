import {
  DataModelBase,
  DataModelBaseSerialized,
} from 'src/app/shared/models/base';
import { DocumentData, Timestamp } from '@angular/fire/firestore';

export class Entry extends DataModelBase {
  timestamp: Date;
  title: string;
  content: string;

  constructor(params: {
    id: string;
    timestamp: Date;
    title: string;
    content: string;
  }) {
    super(params);
  }

  //   SECTION serialization
  override serialize(): EntrySerialized {
    return {
      id: this.id,
      timestamp: Timestamp.fromDate(this.timestamp),
      content: this.content,
      title: this.title,
    };
  }

  static override deserialize(json: EntrySerialized): Entry {
    return new Entry({
      id: json.id,
      timestamp: json.timestamp.toDate(),
      title: json.title,
      content: json.content,
    });
  }
  //   !SECTION
}

export type EntrySerialized = DocumentData &
  DataModelBaseSerialized & {
    timestamp: Timestamp;
    title: string;
    content: string;
  };
