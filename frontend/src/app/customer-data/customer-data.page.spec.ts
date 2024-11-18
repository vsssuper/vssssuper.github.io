import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerDataPage } from './customer-data.page';

describe('CustomerDataPage', () => {
  let component: CustomerDataPage;
  let fixture: ComponentFixture<CustomerDataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
