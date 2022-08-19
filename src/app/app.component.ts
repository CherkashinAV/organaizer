import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'organaizer';

  formStatus: boolean = false;

  toggleForm(open: boolean) {
    this.formStatus = !this.formStatus;
  }
}
