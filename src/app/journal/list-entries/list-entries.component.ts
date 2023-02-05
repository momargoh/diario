import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { Entry } from '../data/models/entry';
import { Base } from 'src/app/shared/components/base.component';
import { EntryService } from '../data/services/entry.service';
import { Observable, map, tap } from 'rxjs';
import { ViewEntryPage } from '../view-entry/view-entry.page';
import { ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-list-entries',
  templateUrl: './list-entries.component.html',
  styleUrls: ['./list-entries.component.scss'],
})
export class ListEntriesComponent extends Base implements OnInit {
  entries$: Observable<Entry[]>;

  constructor(
    private entryService: EntryService,
    private modalController: ModalController,
    private loadingService: LoadingService
  ) {
    super();
  }

  async ngOnInit() {
    await this.loadingService.create('Loading the journal...');
    // sorting of the entries is performed here and not in the service to permit different components to order the entries how they want
    this.entries$ = this.entryService.listEntries().pipe(
      map((entries) => {
        return entries.sort((a, b) => {
          return b.timestamp.valueOf() - a.timestamp.valueOf();
        });
      }),
      tap(() => {
        this.loadingService.dismiss();
      })
    );
  }

  async viewEntry(entry: Entry) {
    const modal = await this.modalController.create({
      component: ViewEntryPage,
      backdropDismiss: false,
      componentProps: { id: entry.id },
    });
    modal.present();
  }
}
