import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loading: HTMLIonLoadingElement;

  constructor(private loadingController: LoadingController) {}

  create(message: string = 'loading...'): Observable<HTMLIonLoadingElement> {
    return from(
      this.loadingController.create({
        message: message,
        spinner: 'circles',
      })
    ).pipe(
      map((loading) => {
        this.loading = loading;
        this.loading.present();
        return this.loading;
      })
    );
  }

  dismiss(): void {
    this.loading?.dismiss();
  }
}
