import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { every } from 'rxjs';
import { DateService } from '../shared/date.service';

@Component({
  selector: 'app-organaizer',
  templateUrl: './organaizer.component.html',
  styleUrls: ['./organaizer.component.scss']
})
export class OrganaizerComponent implements OnInit {

  date!: any; 

  toDo: any[] = ["a"];
  done: any[] = [];


  constructor(private dateService: DateService) { }

  ngOnInit(): void {
    this.date = this.dateService.date;
  }

  drop(event: CdkDragDrop<any[]>) {
    if(event.container === event.previousContainer) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  addTask() {
    this.toDo.push('a');
  }

}
