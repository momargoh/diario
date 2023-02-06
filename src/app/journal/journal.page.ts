import { Component, OnInit } from '@angular/core';
import { Base } from '../shared/components/base.component';
import { ModalController } from '@ionic/angular';
import { WriteEntryPage } from './write-entry/write-entry.page';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage extends Base implements OnInit {
  constructor(
    private modalController: ModalController,
    private auth: AuthService,
    private loading: LoadingService,
    private router: Router
  ) {
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

  async logout() {
    await this.loading.create('Logging you out...');
    try {
      await this.auth.logout();
      this.router.navigate(['/', 'login']);
    } catch (error) {}
    this.loading.dismiss();
  }
}
