import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-element',
  templateUrl: './list-element.component.html',
  styleUrls: ['./list-element.component.scss']
})
export class ListElementComponent implements OnInit {
  @Input() item: any;
  constructor() {}

  ngOnInit() {}

  onCheckboxClick() {
    this.item.active = !this.item.active;
  }
}
