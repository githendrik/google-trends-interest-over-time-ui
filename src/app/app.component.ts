import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiHttpService } from './api-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public startDate: string;
  public endDate: string;
  public keyword: string;

  public response$: Observable<any> = of(null);

  constructor(private apiHttpService: ApiHttpService) {}

  getInterestOverTime() {
    this.response$ = this.apiHttpService.getInterestOverTime(this.keyword, this.startDate, this.endDate);
  }
}
