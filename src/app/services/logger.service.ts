import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoggerData, LogResponse } from '../model/logger-form-model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  masterDataApiurl = environment.baseUrl_MasterDataManagement;
  loggerApiurl = environment.baseUrl_LoggerManagement;

  constructor(private http: HttpClient) { }


  getPlatformModules() {
    return this.http.get<any[]>(this.masterDataApiurl + 'platformModules' 
    
    )
  }
  getLogLevels() {
    return this.http.get<any[]>(this.masterDataApiurl + 'logLevels' 
    
    )
  }

  getLogs(loggerData:LoggerData): Observable<LogResponse[]> {
    return this.http.post<LogResponse[]>(`${this.loggerApiurl + 'logs'}`, loggerData,httpOptions);
  }
}
