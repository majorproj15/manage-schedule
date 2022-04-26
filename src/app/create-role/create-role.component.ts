import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit {

  @ViewChild('confirmationModal') confirmationModal: ElementRef;

  form: FormGroup = new FormGroup({});
  selectedPrefrence = []
  selectedDateList = [];

  years = [
    2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
  ]
  selectedYear = 2022;
  monthList = [
    { display: 'January', value: '01' },
    { display: 'February', value: '02' },
    { display: 'March', value: '03' },
    { display: 'April', value: '04' },
    { display: 'May', value: '05' },
    { display: 'June', value: '06' },
    { display: 'July', value: '07' },
    { display: 'August', value: '08' },
    { display: 'September', value: '09' },
    { display: 'October', value: '10' },
    { display: 'November', value: '11' },
    { display: 'December', value: '12' }
  ]
  selectedMonth = null;

  dateList = [];
  selectedDate = null;

  weekList = [1, 2, 3, 4];
  selectedWeek = null;

  dayList = [
    { display: 'Monday', value: '01' },
    { display: 'Tuesday', value: '02' },
    { display: 'Wednesday', value: '03' },
    { display: 'Thursday', value: '04' },
    { display: 'Friday', value: '05' },
    { display: 'Saturday', value: '06' },
    { display: 'Sunday', value: '07' },
  ];
  selectedDay = null;

  flexibleDates = false;

  constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router) {
    this.form = fb.group({
      name: ['', [Validators.required]]
    })

    if(this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras && this.router.getCurrentNavigation().extras.state){
      const stateData = this.router.getCurrentNavigation().extras.state;
      // holidayType: 'test-rule',
      // month: '',
      // dayOfTheMonth: '',
      // dayOfTheWeek: '',
      // weekOfTheMonth: '',
      // customDays: '01-01,02-01,03-01,04-01,03-31,02-28,01-31,04-30',
      // createdUser: 'User',
      // lastModifiedUser: 'User',
      // isActive: true



      // this.selectedYear = 2022;
      this.flexibleDates = stateData.customDays ? true : false;

      if (this.flexibleDates) {
        this.selectedMonth = null;
        this.selectedDate = null;
        this.selectedWeek = null;
        this.selectedDay = null;

        if(stateData.customDays) {
          stateData.customDays.split(',').forEach(item => {
            this.selectedPrefrence.push(moment(item + '-' + this.selectedYear).format('L'));
          })
        }
  
      } else {
        this.selectedMonth = stateData.month;
        this.selectedWeek = stateData.weekOfTheMonth;
        this.selectedDay = stateData.dayOfTheWeek;

        this.selectedPrefrence = []
      }

      
    }

  }

  changeFlexibledate(evt) {
    this.flexibleDates = evt;
    if (this.flexibleDates) {
      this.selectedMonth = null;
      this.selectedDate = null;
      this.selectedWeek = null;
      this.selectedDay = null;
      this.selectedPrefrence = [];

    } else {
      this.selectedPrefrence = [];
    }
    this.selectedDateList = [];
  }


  ngOnInit(): void {
    
  }


  get f() {
    return this.form.controls;
  }

  changeYear(year) {
    this.selectedYear = year;
    this.selectedMonth = null;
    this.selectedDate = null;
    this.selectedWeek = null;
    this.selectedDay = null;
    this.dateList = [];
  }

  changeMonth(Month) {
    this.selectedMonth = Month;
    this.selectedDate = null;
    this.selectedWeek = null;
    this.selectedDay = null;
    const dates = this.getDateArray(this.selectedYear, this.selectedMonth);
    dates.forEach(date => {
      this.dateList.push(moment(date).format('L'));
    })
  }

  changeDate(date) {
    this.selectedDate = date;
    this.selectedWeek = null;
    this.selectedDay = null;
  }

  changeWeek(week) {
    this.selectedWeek = week;
    this.selectedDate = null;
  }

  changeDay(day) {
    this.selectedDay = day;
    this.selectedDate = null;
  }

  reset() {
    this.selectedDate = null;
    this.selectedWeek = null;
    this.selectedDay = null;
  }

  apply() {
    const reqData = {
      year: this.selectedYear,
      dayOfTheMonth: 0,
      dayOfTheWeek: this.dayList.find(item => item.value === this.selectedDay).display.toUpperCase(),
      month: this.monthList.find(item => item.value === this.selectedMonth).display.toUpperCase(),
      weekOfTheMonth: this.selectedWeek
    }
    this.httpService.getSelectedDate(reqData).subscribe((res: any) => {
      if (res) {
        this.selectedPrefrence = [moment(res).format('L')];
      }
    }, err => {
      console.error(err);

      const date = new Date();
      this.selectedPrefrence = [moment(date).format('L')];
    })

  }

  sendYearChanged(year) {
    this.selectedYear = (new Date(year)).getFullYear();
  }

  cancel() {
    this.selectedMonth = '';
  }

  submitRule() {
    let reqData: any = {};
    if((this.flexibleDates && this.selectedDateList && this.selectedDateList.length > 0) || (!this.flexibleDates && this.selectedMonth && this.selectedWeek && this.selectedDay) ){
      if(this.flexibleDates) {
        reqData = {
          holidayType: this.form.value.name,
          month: '',
          dayOfTheMonth: '',
          dayOfTheWeek: '',
          weekOfTheMonth: '',
          customDays: "",
          createdUser: 'User',
          lastModifiedUser: 'User',
          isActive: true
        }
        this.selectedDateList.forEach(item => {
          if(reqData.customDays === '') {
            reqData.customDays = reqData.customDays + moment(item).format('MM-DD');
          } else {
            reqData.customDays = reqData.customDays + ',' + moment(item).format('MM-DD');
          }
        })

      } else {
        reqData = {
          holidayType: this.form.value.name,
          month: this.selectedMonth,
          dayOfTheMonth: '',
          dayOfTheWeek: this.selectedDay,
          weekOfTheMonth: this.selectedWeek,
          customDays: "",
          createdUser: 'User',
          lastModifiedUser: 'User',
          isActive: true
        }
      }
      debugger;
      this.httpService.saveSelectedDate(reqData).subscribe((res: any) => {
        if (res && res.message === 'HOLIDAY_PERSISTED_SUCCESSFULLY') {
          this.confirmationModal.nativeElement.click();
        }
      }, err => {
        console.error(err);
      })
    }
  }


  dateSelected(dates) {
    this.selectedDateList = dates;
  }

  getDateArray(year, month) {

    let startDate = moment(year + '-' + month + '-01'); //YYYY-MM-DD
    const lastDateOfMonth = startDate.daysInMonth();
    let endDate = moment(year + '-' + month + '-' + lastDateOfMonth); //YYYY-MM-DD 
    let arr = new Array();
    let dt = new Date(startDate.format('L'));
    while (dt <= new Date(endDate.format('L'))) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

}
