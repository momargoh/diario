import { Component, Input, OnInit } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import {
  ModalController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { EntryService } from '../data/services/entry.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Entry } from '../data/models/entry';
import { Observable, combineLatest, map, take, tap } from 'rxjs';
import { Edit } from '../data/models/edit';

@Component({
  standalone: true,
  imports: [SharedModule, QuillModule],
  selector: 'app-view-entry',
  templateUrl: './view-entry.page.html',
  styleUrls: ['./view-entry.page.scss'],
})
export class ViewEntryPage implements OnInit {
  @Input() id: string;
  loading: HTMLIonLoadingElement;
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
  edits: Observable<{
    id: string | null;
    timestamp: Date;
    title: string;
    sanitizedContent: SafeHtml;
  }>[];

  constructor(
    private entryService: EntryService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    //chuck a loading spinner on it all until everything is ready
    this.showLoading().then(() => {
      this.entry$ = this.entryService.getEntry(this.id).pipe(
        tap((entry) => {
          // sanitize the content HTML
          this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(
            entry.content
          );
          // fetch each of the edits and sanitize their content
          this.edits = entry.editIds.map((id) => {
            return this.entryService.getEdit(id).pipe(
              map((edit) => {
                return {
                  ...edit,
                  sanitizedContent: this.domSanitizer.bypassSecurityTrustHtml(
                    edit.content
                  ),
                };
              })
            );
          });

          // if there are edits, wait until they've all been fetched before dismissing the loading spinner, otherwise dismiss immediately
          if (this.edits.length > 0) {
            combineLatest(this.edits)
              .pipe(take(1))
              .subscribe((_) => {
                this.loading.dismiss();
              });
          } else {
            this.loading.dismiss();
          }
        })
      );
    });
  }

  close() {
    this.modalController.dismiss(null, 'close');
  }

  async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'Fetching Entry...',
      spinner: 'circles',
    });
    return this.loading.present();
  }

  update() {}

  delete() {}
}
