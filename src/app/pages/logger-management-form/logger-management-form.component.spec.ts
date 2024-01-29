import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggerManagementFormComponent } from './logger-management-form.component';

describe('LoggerManagementFormComponent', () => {
  let component: LoggerManagementFormComponent;
  let fixture: ComponentFixture<LoggerManagementFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggerManagementFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggerManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
