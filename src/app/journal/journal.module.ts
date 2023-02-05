import { NgModule } from '@angular/core';

import { JournalPageRoutingModule } from './journal-routing.module';

import { JournalPage } from './journal.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule, JournalPageRoutingModule],
  declarations: [JournalPage],
})
export class JournalPageModule {}
