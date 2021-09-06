import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FoodDetailComponent } from './food-detail.component';

describe('Component Tests', () => {
  describe('Food Management Detail Component', () => {
    let comp: FoodDetailComponent;
    let fixture: ComponentFixture<FoodDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FoodDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ food: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FoodDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FoodDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load food on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.food).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
