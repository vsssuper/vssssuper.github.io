import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TurnoverPage } from './turnover.page';

describe('TurnoverPage', () => {
  let component: TurnoverPage;
  let fixture: ComponentFixture<TurnoverPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
