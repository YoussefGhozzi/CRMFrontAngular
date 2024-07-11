import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilSuperAdminComponent } from './accueil-super-admin.component';

describe('AccueilSuperAdminComponent', () => {
  let component: AccueilSuperAdminComponent;
  let fixture: ComponentFixture<AccueilSuperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccueilSuperAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccueilSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
