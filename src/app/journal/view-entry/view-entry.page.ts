import { Component, Input, OnInit } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { ModalController, ToastController } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { EntryService } from '../data/services/entry.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Entry } from '../data/models/entry';
import {
  Observable,
  Subject,
  combineLatest,
  map,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { Base } from 'src/app/shared/components/base.component';
import { WriteEntryPage } from '../write-entry/write-entry.page';

@Component({
  standalone: true,
  imports: [SharedModule, QuillModule],
  selector: 'app-view-entry',
  templateUrl: './view-entry.page.html',
  styleUrls: ['./view-entry.page.scss'],
})
export class ViewEntryPage extends Base implements OnInit {
  @Input() id: string;

  sanitizedContent: SafeHtml;
  entry$: Observable<Entry>;
  edits$: Observable<
    {
      id: string | null;
      timestamp: Date;
      title: string;
      sanitizedContent: SafeHtml;
    }[]
  >;

  // observable to cut off the stream of entry$ and edit$
  private deleteCalledSource = new Subject<void>();
  private deleteCalled$ = this.deleteCalledSource.asObservable();

  constructor(
    private entryService: EntryService,
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingService: LoadingService,
    private domSanitizer: DomSanitizer
  ) {
    super();
  }

  async ngOnInit() {
    await this.loadingService.create('Loading entry...');

    this.entry$ = this.entryService.getEntry(this.id).pipe(
      tap((entry) => {
        // sanitize the Entry content HTML
        this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(
          entry.content
        );
      }),
      takeUntil(this.deleteCalled$) // unsubscribes if delete is called
    );
    this.edits$ = this.entryService.listEdits(this.id).pipe(
      map((edits) => {
        return (
          edits
            // order by timestamp
            .sort((a, b) => {
              return b.timestamp.valueOf() - a.timestamp.valueOf();
            })
            // sanitize the HTML
            .map((edit) => {
              return {
                ...edit,
                sanitizedContent: this.domSanitizer.bypassSecurityTrustHtml(
                  edit.content
                ),
              };
            })
        );
      }),
      takeUntil(this.deleteCalled$)
    );
    // wait until entry$ and edit$ have emitted once before dismissing the loading spinner
    combineLatest([this.entry$, this.edits$])
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadingService.dismiss();
        },
      });
  }

  close() {
    this.modalController.dismiss(null, 'close');
  }

  async update() {
    const modal = await this.modalController.create({
      component: WriteEntryPage,
      componentProps: { mode: 'update', updateId: this.id },
    });
    modal.present();
  }

  async delete() {
    // unsubscribe from entry$ and edit$ to prevent errors from async subscriptions in html file
    this.deleteCalledSource.next();
    try {
      await this.entryService.deleteEntry(this.id);
      this.modalController.dismiss(null, 'close');
      const toast = await this.toastController.create({
        message: 'Successfully deleted Entry.',
        duration: 1500,
        position: 'top',
      });
      toast.present();
    } catch (error) {
      this.modalController.dismiss(null, 'fail');
      const toast = await this.toastController.create({
        message: 'Failed to delete Entry.',
        duration: 1500,
        position: 'top',
      });
      toast.present();
    }
  }
}
