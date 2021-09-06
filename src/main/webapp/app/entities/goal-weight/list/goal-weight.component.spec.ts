import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GoalWeightService } from '../service/goal-weight.service';

import { GoalWeightComponent } from './goal-weight.component';

describe('Component Tests', () => {
  describe('GoalWeight Management Component', () => {
    let comp: GoalWeightComponent;
    let fixture: ComponentFixture<GoalWeightComponent>;
    let service: GoalWeightService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GoalWeightComponent],
      })
        .overrideTemplate(GoalWeightComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GoalWeightComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(GoalWeightService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.goalWeights?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
