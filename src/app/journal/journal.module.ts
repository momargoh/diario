import { NgModule } from '@angular/core';

import { JournalPageRoutingModule } from './journal-routing.module';

import { JournalPage } from './journal.page';
import { SharedModule } from '../shared/shared.module';
import { ListEntriesComponent } from './list-entries/list-entries.component';

@NgModule({
  imports: [SharedModule, JournalPageRoutingModule, ListEntriesComponent],
  declarations: [JournalPage],
})
export class JournalPageModule {}
