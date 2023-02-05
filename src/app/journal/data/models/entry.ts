import {
  DataModelBase,
  DataModelBaseSerialized,
} from 'src/app/shared/models/base';
import { DocumentData, Timestamp } from '@angular/fire/firestore';

export class Entry extends DataModelBase {
  timestamp: Date;
  title: string;
  content: string;
  editIds?: string[];

  constructor(params: {
    id: string | null;
    timestamp: Date;
    title: string;
    content: string;
    editIds?: string[];
  }) {
    super(params);
  }

  hasEdits(): boolean {
    return this.getEditCount() > 0;
  }

  getEditCount(): number {
    return this.editIds?.length ?? 0;
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
      editIds: json.edits?.map((edit) => edit.id),
    });
  }
  //   !SECTION
}

export type EntrySerialized = DocumentData &
  DataModelBaseSerialized & {
    timestamp: Timestamp;
    title: string;
    content: string;
    edits?: { id: string }[];
  };
