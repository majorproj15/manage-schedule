import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
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
  @ViewChild('disbaleConfirmationModal') disbaleConfirmationModal: ElementRef;


  form: FormGroup = new FormGroup({});
  selectedPrefrence = []
  selectedDateList = [];
  editRule = false;
  editRuleId = '';

  years = [
    2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
  ]
  selectedYear = 2022;
  monthList = [
    { display: 'January', value: 1 },
    { display: 'February', value: 2 },
    { display: 'March', value: 3 },
    { display: 'April', value: 4 },
    { display: 'May', value: 5 },
    { display: 'June', value: 6 },
    { display: 'July', value: 7 },
    { display: 'August', value: 8 },
    { display: 'September', value: 9 },
    { display: 'October', value: 10 },
    { display: 'November', value: 11 },
    { display: 'December', value: 12 }
  ]
  selectedMonth = null;
  @ViewChild('monthSelect') monthSelect: MatSelect;
  allMonthSelected=false;

  dateList = [];
  selectedDate = null;
  @ViewChild('weekSelect') weekSelect: MatSelect;
  allWeekSelected=false;

  weekList = [1, 2, 3, 4, 5];
  selectedWeek = null;
  @ViewChild('daySelect') daySelect: MatSelect;
  allDaySelected=false;

  dayList = [
    { display: 'Monday', value: 1 },
    { display: 'Tuesday', value: 2 },
    { display: 'Wednesday', value: 3 },
    { display: 'Thursday', value: 4 },
    { display: 'Friday', value: 5 },
    { display: 'Saturday', value: 6 },
    { display: 'Sunday', value: 7 },
  ];
  selectedDay = null;

  flexibleDates = false;

  constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router) {
    this.form = fb.group({
      name: ['', [Validators.required]]
    })

    // This will trigger in case of edit rule
    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras && this.router.getCurrentNavigation().extras.state) {

      // this is edit rule data coming from dashboard
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

        if (stateData.customDays) {
          stateData.customDays.split(',').forEach(item => {
            this.selectedPrefrence.push(moment(item + '-' + this.selectedYear).format('L'));
          })
        }

      } else {
        // this.changeMonth(stateData.month);
        // this.changeWeek(+stateData.weekOfTheMonth);
        // this.changeDay(stateData.dayOfTheWeek);

        if(stateData.month) {
          // this.changeMonth(this.monthList.find(item => item.display.toUpperCase() == stateData.month).value);
          this.changeMonth(stateData.month);
        }

        this.changeWeek(stateData.weekOfTheMonth);
  
        if(stateData.dayOfTheWeek) {
          // this.changeDay(this.dayList.find(item => item.display.toUpperCase() == stateData.dayOfTheWeek).value);
          this.changeDay(stateData.dayOfTheWeek);
        }

        this.selectedPrefrence = []
        this.apply();
      }

      // Todo needs to check ruleId coming or not
       
      this.editRuleId = stateData.id;

      this.form.patchValue({
        name: stateData.holidayType
      })

      this.editRule = true;


    } else {
      this.editRule = false;
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
    // const dates = this.getDateArray(this.selectedYear, this.selectedMonth);
    // dates.forEach(date => {
    //   this.dateList.push(moment(date).format('L'));
    // })


    let status = true;
    this.monthSelect.options.forEach((item: MatOption) => {
      if (!item.selected) {
        status = false;
      }
    });
    this.allMonthSelected = status;
  }

  toggleAllMonthSelection() {
    if (this.allMonthSelected) {
      this.monthSelect.options.forEach((item: MatOption) => item.select());
    } else {
      this.monthSelect.options.forEach((item: MatOption) => item.deselect());
    }
  }

  changeDate(date) {
    this.selectedDate = date;
    this.selectedWeek = null;
    this.selectedDay = null;
  }

  changeWeek(week) {
    this.selectedWeek = (week && week.length > 0) ? week: null;
    this.selectedDate = null;
    let status = true;
    this.weekSelect.options.forEach((item: MatOption) => {
      if (!item.selected) {
        status = false;
      }
    });
    this.allWeekSelected = status;
  }

  toggleAllWeekSelection() {
    if (this.allWeekSelected) {
      this.weekSelect.options.forEach((item: MatOption) => item.select());
    } else {
      this.weekSelect.options.forEach((item: MatOption) => item.deselect());
    }
  }

  changeDay(day) {
    this.selectedDay = (day && day.length > 0)? day: null;
    this.selectedDate = null;
    let status = true;
    this.daySelect.options.forEach((item: MatOption) => {
      if (!item.selected) {
        status = false;
      }
    });
    this.allDaySelected = status;
  }

  toggleAllDaySelection() {
    if (this.allDaySelected) {
      this.daySelect.options.forEach((item: MatOption) => item.select());
    } else {
      this.daySelect.options.forEach((item: MatOption) => item.deselect());
    }
  }

  reset() {
    this.selectedDate = null;
    this.selectedWeek = null;
    this.selectedDay = null;
  }

  apply() {

    const req = [];

    this.selectedMonth.forEach(month => {
      this.selectedWeek.forEach(week => {
        this.selectedDay.forEach(day => {
          req.push({
            year: this.selectedYear,
            dayOfTheMonth: 0,      
            dayOfTheWeek: day,
            month: month,
            weekOfTheMonth: week
          })
        })
      })
    })

    this.httpService.getSelectedDate(req).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.selectedPrefrence = [];
        res.forEach(item => {
          this.selectedPrefrence.push(moment(item).format('L'));
        })
      }
    }, err => {
      console.error(err);
    })

  }

  sendYearChanged(year) {
    this.selectedYear = (new Date(year)).getFullYear();
  }

  cancel() {
    this.selectedMonth = '';
  }

  disableRuleConfirm() {
    if (this.createRequestData()) {
      let reqData = this.createRequestData();
       
      // check for reqData
      reqData.isActive = 'IN_ACTIVE';
      reqData['id'] = this.editRuleId;

      this.httpService.updateSelectedRule(reqData).subscribe((res: any) => {
        if (res && res.message === 'HOLIDAY_UPDATED_SUCCESSFULLY') {
          this.disbaleConfirmationModal.nativeElement.click();
          this.router.navigate(['dashboard']);
        }
      }, err => {
        console.error(err);
      })
    }
  }

  saveRule() {
    if (this.createRequestData()) {
      let reqData = this.createRequestData();
      if (this.editRuleId) {
        // Update rule
        if (this.flexibleDates) {
          reqData['id'] = this.editRuleId;
        } else {
          reqData.forEach(req => {
            req['id'] = this.editRuleId;
          })
        }

        this.httpService.updateSelectedRule(reqData).subscribe((res: any) => {
          if (res && res.message === 'HOLIDAY_UPDATED_SUCCESSFULLY') {
            this.confirmationModal.nativeElement.click();
            this.router.navigate(['dashboard']);
          }
        }, err => {
          console.error(err);
        })
      } else {
        // Save new rule
        this.httpService.saveSelectedDate(reqData).subscribe((res: any) => {
          if (res && res.message === 'HOLIDAY_PERSISTED_SUCCESSFULLY') {
            this.confirmationModal.nativeElement.click();
            this.router.navigate(['dashboard']);
          }
        }, err => {
          console.error(err);
        })

      }

    }
  }

  createRequestData() {
    let reqData: any = {};
    if ((this.flexibleDates && this.selectedDateList && this.selectedDateList.length > 0) || (!this.flexibleDates && this.selectedMonth && this.selectedWeek && this.selectedDay)) {
      if (this.flexibleDates) {
        reqData = {
          holidayType: this.form.value.name,
          month: null,
          dayOfTheMonth: '',
          dayOfTheWeek: null,
          weekOfTheMonth: '',
          customDays: "",
          createdUser: 'User',
          lastModifiedUser: 'User',
          isActive: 'ACTIVE'
        }
        this.selectedDateList.forEach(item => {
          if (reqData.customDays === '') {
            reqData.customDays = reqData.customDays + moment(item).format('MM-DD');
          } else {
            reqData.customDays = reqData.customDays + ',' + moment(item).format('MM-DD');
          }
        })

        return reqData;

      } else {        
        const req = [];

        this.selectedMonth.forEach(month => {
          this.selectedWeek.forEach(week => {
            this.selectedDay.forEach(day => {
              req.push({

                holidayType: this.form.value.name,
                month: month,
                dayOfTheMonth: '',
                dayOfTheWeek: day,
                weekOfTheMonth: week,
                customDays: "",
                createdUser: 'User',
                lastModifiedUser: 'User',
                isActive: 'ACTIVE'
              })
            })
          })
        })
        return req;
      }
    } else {
      return false;
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
