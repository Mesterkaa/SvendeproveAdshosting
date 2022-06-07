import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensLisstComponent } from './licens-lisst.component';

describe('LicensLisstComponent', () => {
  let component: LicensLisstComponent;
  let fixture: ComponentFixture<LicensLisstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicensLisstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensLisstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
