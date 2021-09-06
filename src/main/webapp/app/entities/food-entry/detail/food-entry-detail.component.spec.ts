import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FoodEntryDetailComponent } from './food-entry-detail.component';

describe('Component Tests', () => {
  describe('FoodEntry Management Detail Component', () => {
    let comp: FoodEntryDetailComponent;
    let fixture: ComponentFixture<FoodEntryDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FoodEntryDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ foodEntry: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FoodEntryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FoodEntryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load foodEntry on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.foodEntry).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
