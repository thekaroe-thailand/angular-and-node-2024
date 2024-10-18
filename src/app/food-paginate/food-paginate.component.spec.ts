import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodPaginateComponent } from './food-paginate.component';

describe('FoodPaginateComponent', () => {
  let component: FoodPaginateComponent;
  let fixture: ComponentFixture<FoodPaginateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodPaginateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodPaginateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
