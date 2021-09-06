import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CurrentWeightDetailComponent } from './current-weight-detail.component';

describe('Component Tests', () => {
  describe('CurrentWeight Management Detail Component', () => {
    let comp: CurrentWeightDetailComponent;
    let fixture: ComponentFixture<CurrentWeightDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CurrentWeightDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ currentWeight: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CurrentWeightDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CurrentWeightDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load currentWeight on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.currentWeight).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
