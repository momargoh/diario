import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { Entry } from '../data/models/entry';
import { Base } from 'src/app/shared/components/base.component';
import { EntryService } from '../data/services/entry.service';
import { Observable, map } from 'rxjs';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-list-entries',
  templateUrl: './list-entries.component.html',
  styleUrls: ['./list-entries.component.scss'],
})
export class ListEntriesComponent extends Base implements OnInit {
  entries$: Observable<Entry[]>;

  constructor(private entryService: EntryService) {
    super();
  }

  ngOnInit() {
    // sorting of the entries is performed here and not in the service to permit different components to order the entries how they want
    this.entries$ = this.entryService.listEntries().pipe(
      map((entries) => {
        return entries.sort((a, b) => {
          return b.timestamp.valueOf() - a.timestamp.valueOf();
        });
      })
    );
  }

  viewEntry(entry: Entry) {
    console.log('view entry', entry);
  }
}
