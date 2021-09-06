import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FoodDayService } from '../service/food-day.service';

import { FoodDayComponent } from './food-day.component';

describe('Component Tests', () => {
  describe('FoodDay Management Component', () => {
    let comp: FoodDayComponent;
    let fixture: ComponentFixture<FoodDayComponent>;
    let service: FoodDayService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FoodDayComponent],
      })
        .overrideTemplate(FoodDayComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FoodDayComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FoodDayService);

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
      expect(comp.foodDays?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
