import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: '',
  template: '',
  styles: [''],
})
export abstract class Base {
  protected subscriptions: Subscription[] = [];

  constructor() {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  addSubscriptions(...subscriptions: Subscription[]): void {
    this.subscriptions.push(...subscriptions);
  }
}
