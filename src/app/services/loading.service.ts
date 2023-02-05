import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading: HTMLIonLoadingElement;

  constructor(private loadingController: LoadingController) {}

  async create(message: string = 'loading...'): Promise<void> {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'circles',
    });
    this.loading = loading;
    return this.loading.present();
  }

  dismiss(): void {
    this.loading?.dismiss();
  }
}
