import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuillModule } from 'ngx-quill';
import {
  ModalController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DoNotShowAgainService } from 'src/app/services/do-not-show-again.service';
import {
  CreateEntryParams,
  EntryService,
} from '../data/services/entry.service';
@Component({
  standalone: true,
  imports: [SharedModule, QuillModule],
  selector: 'app-write-entry',
  templateUrl: './write-entry.page.html',
  styleUrls: ['./write-entry.page.scss'],
})
export class WriteEntryPage implements OnInit {
  mode: 'create' | 'update' = 'create';

  entryForm = new FormGroup({
    title: new FormControl<string | null>(null, [Validators.required]),
    content: new FormControl<string | null>(null, [Validators.required]),
  });

  quillModules = {
    toolbar: [
      [{ font: ['sans-serif', 'serif', 'monospace'] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'code-block',
        { script: 'sub' },
        { script: 'super' },
      ], // toggled buttons
      [
        { align: [] },
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ], // outdent/indent

      // ['clean'], // remove formatting button
    ],
  };

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private doNotShowAgainService: DoNotShowAgainService,
    private entryService: EntryService
  ) {}

  ngOnInit() {}

  async save() {
    if (this.entryForm.valid) {
      this.entryForm.disable(); // prevent multiple submissions
      try {
        await this.entryService.createEntry(
          this.entryForm.value as CreateEntryParams
        );

        this.modalController.dismiss(null, 'save');
        const toast = await this.toastController.create({
          message: `Your entry has been saved!`,
          duration: 1500,
          position: 'top',
        });
        toast.present();
      } catch (error) {
        this.modalController.dismiss(null, 'fail');
        const toast = await this.toastController.create({
          message: `Error creating your entry, try again later!`,
          duration: 1500,
          position: 'top',
        });
        toast.present();
      }
    }
  }

  cancel() {
    if (this.entryForm.touched) {
      this.presentAlert();
    } else {
      this.modalController.dismiss(null, 'cancel');
    }
  }

  async presentAlert() {
    if (this.doNotShowAgainService.getValue('cancel-touched-write-entry')) {
      this.modalController.dismiss(null, 'cancel');
    } else {
      let doNotShowAgain: boolean = false;
      const alert = await this.alertController.create({
        header: `You have unsaved changes that you will lose if you close this box. Are you sure you want to proceed?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'OK',
            role: 'confirm',
            cssClass: 'ion-color-primary',
          },
        ],
        inputs: [
          {
            type: 'checkbox',
            name: 'doNotShowAgain',
            label: 'Do not show again.',
            value: false,
            handler(input) {
              doNotShowAgain = input.checked === true;
            },
          },
        ],
      });

      await alert.present();

      const { role } = await alert.onDidDismiss();
      if (doNotShowAgain) {
        this.doNotShowAgainService.setValue(
          'cancel-touched-write-entry',
          doNotShowAgain
        );
      }
      if (role === 'confirm') {
        this.modalController.dismiss(null, 'cancel');
      }
    }
  }
}
