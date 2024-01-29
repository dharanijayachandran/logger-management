import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { LoggerData, LoggerFormModel } from 'src/app/model/logger-form-model';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-logger-management-form',
  templateUrl: './logger-management-form.component.html',
  styleUrls: ['./logger-management-form.component.css']
})
export class LoggerManagementFormComponent implements OnInit {

  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  @ViewChild(MatPaginator) myPaginator: MatPaginator;

  @ViewChild(UIModalNotificationPage) modelNotification;

  sort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  noRerocrdFound: boolean;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  loggerDataForm: FormGroup;
  platformModulesList: any;
  logLevels: any;
  modulesForMultiSelect: any[] = [];
  logLevelsForMultiSelect: any[] = [];

  selectedModules: any[] = [];
  selectedLevels: any[] = [];
  logData: any[];
  settings = {};
  curDate: string;
  todayDate: { month: number; day: number; year: number; };
  minDate: { month: number; day: number; year: number; };
  endDate: { month: number; day: number; year: number; };
  validateTime: boolean;
  validateEndTime: boolean;
  loggerForm: LoggerFormModel;
  isDisabled: false;
  private loggerData: LoggerData = new LoggerData();
  validTime = false;

  displayedColumns: string[] = ['id', 'moduleName', 'level', 'date', 'message'];
  showListOfReport: boolean;
  showLoaderImage = false;
  panelEnable = true;
  assetList: any;




  dataSource: MatTableDataSource<any>;


  constructor(private formBuilder: FormBuilder, private globalService: globalSharedService, private loggerService: LoggerService) { }

  ngOnInit(): void {
    this.loadFormData();
    this.loadPlatformModules()
    this.loadLogLevels();
    this.dataSource = new MatTableDataSource();

  }
  requiredFormat(items) {
    const that = this;
    return items && items.length ? items.map(function (o) {
      var returnObj = {
        "id": o.id,
        "itemName": o.name
      }
      return returnObj;
    }) : [];
  }
  OnSelectedModules(item: any) {
    this.selectedModules.push(item);
  }
  OnSelectedLeve(item: any) {
    this.selectedLevels.push(item);
  }
  OnItemDeSelectModule(item: any) {
    this.selectedModules = this.selectedModules.filter(obj => obj !== item);
  }
  OnItemDeSelectLevel(item: any) {
    this.selectedLevels = this.selectedLevels.filter(obj => obj !== item);
  }

  onSelectAllModules(items: any) {
    this.selectedModules = items;
  }
  onSelectAllLevels(items: any) {
    this.selectedLevels = items;
  }

  onDeSelectAllModules(items: any) {
    this.selectedModules = [];
  }
  onDeSelectAllLevels(items: any) {
    this.selectedLevels = [];
  }



  loadFormData() {
    this.loggerDataForm = this.formBuilder.group({
      module: [[], [Validators.required]],
      level: [[],],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],

    });

    this.settings = {
      enableSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      badgeShowLimit: 0,
      text: $localize`:@@multiSelectDropdown.select:--Select--`,
      noDataLabel: $localize`:@@multiSelectDropdown.noDataLabel:No Data Available`

    };
    this.patchDates();
    this.futureDateDisabled();

  }

  futureDateDisabled() {
    this.curDate = formatDate(new Date(), 'MM/dd/yyyy', 'en');
    let fullDate = this.curDate.split('/');
    //let currenatDay = this.dayCalculate(fullDate[2]);
    this.todayDate =
    {
      month: parseInt(fullDate[0]),
      day: parseInt(fullDate[1]),
      year: parseInt(fullDate[2])
    }
    this.minDate = this.todayDate;
    this.endDate = this.todayDate
  }
  loadPlatformModules() {
    this.loggerService.getPlatformModules().subscribe(res => {

      this.platformModulesList = res;
      this.modulesForMultiSelect = this.requiredFormat(res);
      this.modulesForMultiSelect=this.modulesForMultiSelect.sort((a, b) => a.itemName.localeCompare(b.itemName));

    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);

      }
    );
  }

  loadLogLevels() {
    this.loggerService.getLogLevels().subscribe(res => {

      this.logLevels = res;
      this.logLevelsForMultiSelect = this.requiredFormat(res);
      this.logLevelsForMultiSelect=this.logLevelsForMultiSelect.sort((a, b) => a.itemName.localeCompare(b.itemName));


    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error)

      }
    );
  }
  addMinDateValue() {
    let startDate = this.fetchStartDateFromPicker();
    if (null != startDate) {
      let fullDate = startDate.split('/');
      this.minDate =
      {
        month: parseInt(fullDate[0]),
        day: parseInt(fullDate[1]),
        year: parseInt(fullDate[2]),
      }
    }
  }
  fetchStartDateFromPicker() {
    if (null != this.loggerDataForm.value.startDate) {
      let newYrs = this.loggerDataForm.value.startDate.year;
      let newDay = this.loggerDataForm.value.startDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.loggerDataForm.value.startDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let reqDateOfBirth = newMon + '/' + newDay + '/' + newYrs;
      return reqDateOfBirth;
    }
  }
  validateFromDate() {
    let startDay = this.loggerDataForm.value.startDate.day;
    let endDay = this.loggerDataForm.value.endDate.day;
    if (startDay > endDay) {
      this.loggerDataForm.patchValue({
        startDate: this.fetchStartDateFromPicker()
      }, { emitEvent: false });
    }
    let endMonth = this.loggerDataForm.value.endDate.month;
    let startMonth = this.loggerDataForm.value.startDate.month;
    if (endMonth > startMonth) {
      this.loggerDataForm.patchValue({
        startDate: this.fetchStartDateFromPicker()
      }, { emitEvent: false });
    }
  }
  fetchEndDateFromPicker() {
    if (null != this.loggerDataForm.value.endDate) {
      let newDay = this.loggerDataForm.value.endDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.loggerDataForm.value.endDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.loggerDataForm.value.endDate.year;
      let reqDateOfBirth = newMon + '/' + newDay + '/' + newYrs;
      return reqDateOfBirth;
    }
  }
  changeStartDate(event: any) {
    this.validateStartAndEndTime('startTime');
  }
  changeEndDate(event: any) {
    this.validateStartAndEndTime('endTime');
  }
  resetTimeValidationControlls() {
    this.validateTime = false;
    this.validateEndTime = false;
    this.loggerDataForm.controls['startTime'].markAsUntouched()
    this.loggerDataForm.controls['startTime'].markAsPristine()
    this.loggerDataForm.controls['startTime'].updateValueAndValidity();
    this.loggerDataForm.controls['endTime'].markAsUntouched()
    this.loggerDataForm.controls['endTime'].markAsPristine()
    this.loggerDataForm.controls['endTime'].updateValueAndValidity();
  }

  validateStartAndEndTime(id: any) {

      this.resetTimeValidationControlls()
        let startDate = this.fetchStartDateFromPicker()
        let endDate = this.fetchEndDateFromPicker()
        if (startDate === endDate) {
          this.loggerForm = <LoggerFormModel>this.loggerDataForm.value
      let startTime = this.loggerForm.startTime
          let endTimeTime = this.loggerForm.endTime
          let strtHr, strtMin, endHr, endMin
          if (startTime.length != 0) {
            let startTimeArray = startTime.split(':')
            strtHr = parseInt(startTimeArray[0]);
            strtMin = parseInt(startTimeArray[1]);
          }
          if (endTimeTime.length != 0) {
            let endTimeTimeArray = endTimeTime.split(':')
            endHr = parseInt(endTimeTimeArray[0]);
            endMin = parseInt(endTimeTimeArray[1]);
          }
          if (id == 'startTime'){
            if (strtHr >= endHr) {
              if (strtMin >= endMin) {
                this.validateTime = true
                // this.assetDataReportForm.controls['startTime'].setValidators([Validators.required]);
             this.loggerDataForm.controls['startTime'].markAsTouched();
             this.loggerDataForm.controls['startTime'].updateValueAndValidity();
             this.loggerDataForm.controls['startTime'].setErrors({
               'required': true
             })
              } if (strtHr > endHr) {
                this.validateTime = true
                // this.assetDataReportForm.controls['startTime'].setValidators([Validators.required]);
             this.loggerDataForm.controls['startTime'].markAsTouched();
             this.loggerDataForm.controls['startTime'].updateValueAndValidity();
             this.loggerDataForm.controls['startTime'].setErrors({
               'required': true
             })
              }
             // this.assetDataReportForm.setErrors({ 'invalid': true });

            }
          }
          else if(id=='endTime'){
            if (strtHr >= endHr) {
              if (strtMin >= endMin) {
                this.validateEndTime = true
                this.loggerDataForm.controls['endTime'].markAsTouched();
                this.loggerDataForm.controls['endTime'].updateValueAndValidity();
                this.loggerDataForm.controls['endTime'].setErrors({
                  'required': true
                })
              } if (strtHr > endHr) {
                this.validateEndTime = true
                this.loggerDataForm.controls['endTime'].markAsTouched();
                this.loggerDataForm.controls['endTime'].updateValueAndValidity();
                this.loggerDataForm.controls['endTime'].setErrors({
                  'required': true
                })
              }
              //this.assetDataReportForm.setErrors({ 'invalid': true });

            }

          }

        }


     }


  patchDates() {
    //this.showListOfReport = false;
    let date = new Date();

    let startDate = formatDate(date, 'MM/dd/yyyy HH:mm', 'en');

    let arrayDate = startDate.split('/');
    let time = arrayDate[2];
    let currentTime = time.split(' ');
    let fullDate = {
      month: parseInt(arrayDate[0]),
      day: parseInt(arrayDate[1]),
      year: parseInt(arrayDate[2])
    }
    this.loggerDataForm.patchValue({
      startDate: fullDate,
      endDate: fullDate,
      startTime: '01:00',
      endTime: currentTime[1]
    })
  }
  validateFromStartFromEndDate() {
    let date = this.fetchEndDateFromPicker()
    if (null != date) {
      let fullDate = date.split('/');
      this.endDate =
      {
        month: parseInt(fullDate[0]),
        day: parseInt(fullDate[1]),
        year: parseInt(fullDate[2]),
      }
      this.addMinDateValue();
    }
  }
  formatStartTime(startTime) {
    if (startTime == null) {
      this.validTime = true;
      return null;
    }
    if (startTime === 'startTime') {
      return startTime = ''
    }
    if (startTime.length == 0) {
      return startTime = '00:00:00'
    } else {
      return startTime = startTime + ':00';
    }
  }
  formatEndTime(endTime, endDate) {
    if (endTime === 'endTime') {
      return endTime = '';
    }
    if (endTime == null) {
      this.validTime = true;
      return null;
    }
    if (endTime.length == 0) {
      this.validTime = false;
      let endDateTdy = new Date();
      var year = endDateTdy.getFullYear();
      var month = endDateTdy.getMonth() + 1;
      let mth, d, totaldate;
      if (month <= 9) {
        mth = '0' + month;
      } else {
        mth = month
      }
      var day = endDateTdy.getDate();
      if (day <= 9) {
        d = '0' + day;
      } else {
        d = day;
      }
      totaldate = year + '-' + mth + '-' + d
      if (endDate !== totaldate) {
        return endTime = '23:59:59';
      } else {
        var hours = endDateTdy.getHours();
        let hr;
        var minutes = endDateTdy.getMinutes();
        let min;
        if (hours <= 9) {
          hr = '0' + hours;
        } else {
          hr = hours
        }
        if (minutes <= 9) {
          min = '0' + minutes;
        } else {
          min = minutes;
        }
        let currentTime = hr + ":" + min + ':59';
        return endTime = currentTime
      }
    } else {
      return endTime = endTime + ':00'
    }
  }

  sendForm() {
    this.panelEnable = true;
    this.showListOfReport = false;
    this.dataSource.data = [];
    this.loggerData = <LoggerData>this.loggerDataForm.value;
    this.loggerData = <LoggerData>this.loggerDataForm.value;
    let startDate = this.fetchStartDateFromPickerForApiCall();
    let startTime = this.formatStartTime(this.loggerData.startTime);
    let endDate = this.fetchEndDateFromPickerForApiCall();
    let endTime = this.formatEndTime(this.loggerData.endTime, endDate);
    if (!startDate.includes("undefined")) {
      startDate = startDate + 'T' + startTime;
      endDate = endDate + 'T' + endTime;
      this.loggerData.startDate = startDate;
      this.loggerData.endDate = endDate;
      this.showLoaderImage = true;
      this.loggerService.getLogs(this.loggerData).subscribe((res) => {
        res.sort((a, b) => {
          return b.date - a.date;
        });

        if (res.length != 0) {
          res.forEach(u => { delete u.className; delete u.methodName; });
          res.forEach(function (arrayItem) {
            var x = arrayItem.date;
            var date = new Date(x);
            arrayItem.date = date.toLocaleString()
          });
        }

        this.logData = res;
        this.dataSource.data = this.logData;
        this.showLoaderImage = false;

        // To get paginator events from child mat-table-paginator to access its properties
        // this.myPaginator = this.myPaginatorChildComponent.getDatasource();
        this.matTablePaginator(this.myPaginator);
        this.dataSource.paginator = this.myPaginator;
        if (this.logData.length != 0) {
          this.noRerocrdFound = false;
          this.panelEnable = false;
          this.showListOfReport = true
        }
      },
        (error: any) => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);

        }
      );

    }
    else {
      this.showLoaderImage = true;
      this.loggerService.getLogs(this.loggerData).subscribe((res) => {
        res.sort((a, b) => {
          return b.date - a.date;
        });

        if (res.length != 0) {
          res.forEach(u => { delete u.className; delete u.methodName; });
          res.forEach(function (arrayItem) {
            var x = arrayItem.date;
            var date = new Date(x);
            arrayItem.date = date.toLocaleString()
          });
        }

        this.logData = res;
        this.dataSource.data = this.logData;
        this.showLoaderImage = false;

        // To get paginator events from child mat-table-paginator to access its properties
        // this.myPaginator = this.myPaginatorChildComponent.getDatasource();
        this.matTablePaginator(this.myPaginator);
        this.dataSource.paginator = this.myPaginator;
        if (this.logData.length != 0) {
          this.noRerocrdFound = false;
          this.panelEnable = false;
          this.showListOfReport = true
        }
      },
        (error: any) => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);

        }
      );

    }

  }

  resetForm() {
    this.loggerDataForm.reset()
    this.loadFormData();
    this.panelEnable = true;
    this.showListOfReport = false;
    this.dataSource.data = [];
    this.validateTime = false;
    this.validateEndTime = false;
  }
  fetchStartDateFromPickerForApiCall() {
    if (null != this.loggerDataForm.value.startDate) {
      let newDay = this.loggerDataForm.value.startDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.loggerDataForm.value.startDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.loggerDataForm.value.startDate.year;
      let reqDate = newDay + '/' + newMon + '/' + newYrs;
      return reqDate;
    }
  }
  fetchEndDateFromPickerForApiCall() {
    if (null != this.loggerDataForm.value.endDate) {
      let newDay = this.loggerDataForm.value.endDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.loggerDataForm.value.endDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.loggerDataForm.value.endDate.year;
      let reqDateOfBirth = newDay + '/' + newMon + '/' + newYrs;
      return reqDateOfBirth;
    }
  }
  // myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;

  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }
  setColumn(res: any[]) {
    let keys = Object.keys(res[0]);
    this.displayedColumns = keys;

  }
  /* Load table data always to the Top of the table
when change paginator page(Next, Prev, Last, First), Page size  */
  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  refreshTableListFunction() {
    if (this.dataSource.data.length > 0) {
      this.sendForm()
    }

  }



}
