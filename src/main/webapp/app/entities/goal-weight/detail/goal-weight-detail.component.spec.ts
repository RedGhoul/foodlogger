import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GoalWeightDetailComponent } from './goal-weight-detail.component';

describe('Component Tests', () => {
  describe('GoalWeight Management Detail Component', () => {
    let comp: GoalWeightDetailComponent;
    let fixture: ComponentFixture<GoalWeightDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [GoalWeightDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ goalWeight: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(GoalWeightDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GoalWeightDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load goalWeight on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.goalWeight).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
