import {
  DataModelBase,
  DataModelBaseSerialized,
} from 'src/app/shared/models/base';
import { Timestamp } from '@angular/fire/firestore';

export class Edit extends DataModelBase {
  timestamp: Date;
  title: string;
  content: string;

  constructor(params: {
    id: string | null;
    timestamp: Date;
    title: string;
    content: string;
  }) {
    super(params);
  }

  //   SECTION serialization
  override serialize(): EditSerialized {
    return {
      id: this.id,
      timestamp: Timestamp.fromDate(this.timestamp),
      content: this.content,
      title: this.title,
    };
  }

  static override deserialize(json: EditSerialized): Edit {
    return new Edit({
      id: json.id,
      timestamp: json.timestamp.toDate(),
      title: json.title,
      content: json.content,
    });
  }
  //   !SECTION
}

export type EditSerialized = DataModelBaseSerialized & {
  timestamp: Timestamp;
  title: string;
  content: string;
};
