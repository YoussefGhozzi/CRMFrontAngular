import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  BoardSecretaireComponent } from './board-Secretaire.component';

describe('BoardModeratorComponent', () => {
  let component:  BoardSecretaireComponent;
  let fixture: ComponentFixture<  BoardSecretaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [  BoardSecretaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent( BoardSecretaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
