import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailListComponentComponent } from './email-list-component.component';

describe('EmailListComponentComponent', () => {
  let component: EmailListComponentComponent;
  let fixture: ComponentFixture<EmailListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailListComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
