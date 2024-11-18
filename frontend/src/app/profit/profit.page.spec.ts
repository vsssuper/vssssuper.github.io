import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfitPage } from './profit.page';

describe('ProfitPage', () => {
  let component: ProfitPage;
  let fixture: ComponentFixture<ProfitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
