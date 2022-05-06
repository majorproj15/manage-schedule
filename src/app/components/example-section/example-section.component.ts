import { Component, OnInit, EventEmitter, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, Output } from '@angular/core';
import { WeekNumberPipe } from 'src/app/lib/pipes/week-number/week-number.pipe';
import { YCConfig } from 'src/app/lib/year-calendar-interfaces';
import * as moment from 'moment';

@Component({
  selector: 'ycd-example-section',
  templateUrl: './example-section.component.html',
  styleUrls: ['./example-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleSectionComponent implements OnInit, OnChanges {

  @Input() year = '';
  @Input() prefrence = [];
  @Input() prefrenceExclude = [];
  @Input() customDateSelection = true;
  @Output() dateSelected = new EventEmitter();

  ycConfig: YCConfig = {
    heatmapColor: '#FF5500',
    data: [],
    nextBtn: {
      text: 'Next',
      class: 'btn btn-dark',
    },
    prevBtn: {
      text: 'Previous',
      class: 'btn btn-dark',
    },
    todayBtn: {
      hide: false,
      class: 'btn btn-primary'
    },
    firstWeekMonth: {
      month: 0, // January
      week: 0 // use `null` for standard weeks and calculations
    },
    showWeekNumbers: false,
    weekNumbersColor: '#778CA2',
    dayClass: 'year-calendar-day',
    maxValue: 10 // let the component calculate the max value from all values,
  };

  selectedDates: any;

  prefrences: any = [];

  @Output() sendYearChanged = new EventEmitter();

  selectPrefrences() {
    this.selectedDates = {
      date: new Date('01/01/' + this.year),
      list: this.prefrences
    }
    this.finalSelectedDates = this.selectedDates.list;
    this.dateSelected.emit(this.finalSelectedDates);
  }
  
  @Input() loadingData = false;
  @Input() calendarDate = new Date();
  weekNumberPipe = new WeekNumberPipe();

  finalSelectedDates = [];
  constructor() { }

  ngOnInit() {
    this.selectedDates = {
      date: new Date('01/01/' + this.year),
      list: this.prefrences
    }
    this.finalSelectedDates = this.selectedDates.list;
    this.dateSelected.emit(this.finalSelectedDates);
  }

  ngOnChanges(changes: SimpleChanges) {

    // if(changes.prefrence && !changes.prefrence.firstChange && changes.prefrence.currentValue) {
    //   this.prefrences = [];..
    // }
    
    if(changes.prefrence && changes.prefrence.currentValue) {
      if(this.customDateSelection) {
        this.prefrences = changes.prefrence.currentValue.length === 0? []: this.prefrences;
        changes.prefrence.currentValue.forEach(item => {
          if(moment(item).isValid()) {
              this.prefrences.push(moment(item));
          }
        })
      } else {
        this.prefrences = [];
        changes.prefrence.currentValue.forEach(item => {
          if(moment(item).isValid()) {
              this.prefrences.push(moment(item));
          }
        })
      }
    }

    if(changes.prefrenceExclude && changes.prefrenceExclude.currentValue && changes.prefrenceExclude.currentValue.length > 0) {
      changes.prefrenceExclude.currentValue.forEach(item => {
        if(moment(item).isValid()) {
          this.prefrences = this.prefrences.filter(val => {
            return moment(val).format('L') !== moment(item).format('L')
          })
        }
      })
    }

    this.selectPrefrences();

  }

  mondaysInMonth(m,y) {
    let days = new Date(y,m,0).getDate();
    let mondays: any =  new Date(m +'/01/'+ y).getDay();
    if(mondays != 1){
      mondays = 9 - mondays;
    }
    mondays = [mondays];
    //console.log(mondays);
    for (let i = mondays[0] + 7; i <= days; i += 7) {
      mondays.push(i);
    }

    let mandaydates = [];
    mondays.forEach(date => {
      mandaydates.push(new Date(m + '/' + date + '/' + y))
    })

    return mandaydates;
  }

  yearChanged($event: any) 
  {
    this.calendarDate = new Date($event, this.calendarDate.getMonth(), this.calendarDate.getDate());
    this.sendYearChanged.emit(this.calendarDate);
  }

  dayClicked($event: any) {
    const findIndex = this.finalSelectedDates.findIndex(item => moment(item).format('L') === moment($event.day.date).format('L'));
    if(findIndex > -1) {
      this.finalSelectedDates = this.finalSelectedDates.filter(item => {
        return moment(item).format('L') !== moment($event.day.date).format('L') ? true : false;
      })
    } else {
      this.finalSelectedDates.push(new Date($event.day.date));
    }
    this.dateSelected.emit(this.finalSelectedDates);
  }

}
