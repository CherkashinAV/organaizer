import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DateService } from '../shared/date.service';

@Component({
  selector: 'app-select-month',
  templateUrl: './select-month.component.html',
  styleUrls: ['./select-month.component.scss']
})
export class SelectMonthComponent implements OnInit {

  constructor(public dateService: DateService) { }

  ngOnInit(): void {
  }


  changeDate(step: number) {
    this.dateService.changeMonth(step);
  }

}
