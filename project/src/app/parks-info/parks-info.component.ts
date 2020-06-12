import { Component, OnInit } from '@angular/core';
import { SiteService } from '../site.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-parks-info',
  templateUrl: './parks-info.component.html',
  styleUrls: ['./parks-info.component.css']
})
export class ParksInfoComponent implements OnInit {
  parksInfoArray: any = [];
  thingsToDoArray: any = [];
  alertsArray: any = [];
  constructor(private service: SiteService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(response => {
      console.log(response.q)
      this.service.getParks(response.q).subscribe(parksResponse => {
        this.parksInfoArray = parksResponse.data;
        console.log(parksResponse.data);
      });

    });
    this.route.queryParams.subscribe(response => {
      this.service.getThingsToDo(response.q).subscribe(thingsToDoResponse => {
        this.thingsToDoArray = thingsToDoResponse.data;
        console.log(thingsToDoResponse.data);
      });
    });

    this.route.queryParams.subscribe(response => {
      this.service.getAlerts(response.q).subscribe(alertsResponse => {
        this.alertsArray = alertsResponse.data;
        console.log(alertsResponse.data);
      });
    });
  }
};