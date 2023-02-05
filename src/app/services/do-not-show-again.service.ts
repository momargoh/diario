import { Injectable } from '@angular/core';

export type DoNotShowAgainKey = 'cancel-touched-write-entry';

@Injectable({
  providedIn: 'root',
})
export class DoNotShowAgainService {
  private doNotShowAgainList: string[];

  constructor() {}

  private getStoredList(): string[] {
    if (!this.doNotShowAgainList) {
      const doNotShowAgainStorageValue: string | null =
        localStorage.getItem('do-not-show-again');
      if (!doNotShowAgainStorageValue) {
        this.doNotShowAgainList = [];
      } else {
        this.doNotShowAgainList = JSON.parse(doNotShowAgainStorageValue);
        if (!(this.doNotShowAgainList instanceof Array)) {
          this.doNotShowAgainList = [];
        }
      }
    }
    return this.doNotShowAgainList;
  }

  getValue(key: DoNotShowAgainKey): boolean {
    return this.getStoredList().includes(key);
  }

  setValue(key: DoNotShowAgainKey, value: boolean) {
    this.getStoredList();

    const keyIncluded = this.doNotShowAgainList.includes(key);
    if (keyIncluded && value === false) {
      this.doNotShowAgainList = this.doNotShowAgainList.filter(
        (k) => key !== key
      );
    } else if (!keyIncluded && value === true) {
      this.doNotShowAgainList.push(key);
    }
    localStorage.setItem(
      'do-not-show-again',
      JSON.stringify(this.doNotShowAgainList)
    );
  }
}
