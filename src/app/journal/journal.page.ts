import { Component, OnInit } from '@angular/core';
import { Base } from '../shared/components/base.component';
import { ModalController } from '@ionic/angular';
import { WriteEntryPage } from './write-entry/write-entry.page';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage extends Base implements OnInit {
  constructor(private modalController: ModalController) {
    super();
  }

  ngOnInit() {}

  async createEntry() {
    const modal = await this.modalController.create({
      component: WriteEntryPage,
      backdropDismiss: false,
    });
    modal.present();
  }
}
