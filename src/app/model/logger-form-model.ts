export class LoggerFormModel {
    Id: number;
      startDate: string;
      endDate: string;
      startTime: string
      endTime: string
}

export class LoggerData {
  modules:    any;
  levels:any;
  startDate:any;
  startTime:any;
  endDate:any;
  endTime:any;
}
export class LogResponse{
  id:any;
  moduleName:any;
  level:any;
  date:any;
  message:any;
  className:any;
  methodName:any;
}