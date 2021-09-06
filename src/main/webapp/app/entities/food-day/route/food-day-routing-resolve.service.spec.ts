jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFoodDay, FoodDay } from '../food-day.model';
import { FoodDayService } from '../service/food-day.service';

import { FoodDayRoutingResolveService } from './food-day-routing-resolve.service';

describe('Service Tests', () => {
  describe('FoodDay routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FoodDayRoutingResolveService;
    let service: FoodDayService;
    let resultFoodDay: IFoodDay | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FoodDayRoutingResolveService);
      service = TestBed.inject(FoodDayService);
      resultFoodDay = undefined;
    });

    describe('resolve', () => {
      it('should return IFoodDay returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFoodDay = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFoodDay).toEqual({ id: 123 });
      });

      it('should return new IFoodDay if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFoodDay = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFoodDay).toEqual(new FoodDay());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FoodDay })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFoodDay = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFoodDay).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
