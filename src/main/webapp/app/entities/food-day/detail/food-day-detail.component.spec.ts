import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FoodDayDetailComponent } from './food-day-detail.component';

describe('Component Tests', () => {
  describe('FoodDay Management Detail Component', () => {
    let comp: FoodDayDetailComponent;
    let fixture: ComponentFixture<FoodDayDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FoodDayDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ foodDay: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FoodDayDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FoodDayDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load foodDay on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.foodDay).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
