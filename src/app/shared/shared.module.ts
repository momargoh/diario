import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

const sharedModules: any[] = [CommonModule, FormsModule, IonicModule];

const declarations: any[] = [];

@NgModule({
  imports: sharedModules,
  declarations: declarations,
  exports: [...sharedModules, ...declarations],
})
export class SharedModule {}
