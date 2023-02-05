import { Component, OnInit } from '@angular/core';
import { Base } from '../shared/components/base.component';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage extends Base implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
