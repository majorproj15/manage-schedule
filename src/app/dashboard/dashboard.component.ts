import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  displayedColumns = ["name", "active", "ruleIds", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  dataSource: any = [];

  displayedRuleColumns = ["id", "holidayType", "isActive", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  ruleDataSource: any = [];

  constructor(private httpService:HttpService, private router: Router) {}

    ngOnInit() {
        this.httpService.getAllCalender('2022').subscribe((res: any) => {
          if (res) {
            this.dataSource = res;
          }
        }, err => {
          console.error(err);
        })

        this.httpService.getAllRules().subscribe((res: any) => {
          if (res) {
            this.ruleDataSource = res;
          }
        }, err => {
          console.error(err);
        })

        this.ruleDataSource = [{
          id: 123
        }]

    }

    goToCreateRule(row) {
      this.httpService.getRuleDetails(row.holidayType).subscribe((res: any) => {
        if (res) {
           
          this.router.navigate(['create-rule'], {state: res});
        }
      }, err => {
        console.error(err);
      })
    }

}
