jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFood, Food } from '../food.model';
import { FoodService } from '../service/food.service';

import { FoodRoutingResolveService } from './food-routing-resolve.service';

describe('Service Tests', () => {
  describe('Food routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FoodRoutingResolveService;
    let service: FoodService;
    let resultFood: IFood | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FoodRoutingResolveService);
      service = TestBed.inject(FoodService);
      resultFood = undefined;
    });

    describe('resolve', () => {
      it('should return IFood returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFood = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFood).toEqual({ id: 123 });
      });

      it('should return new IFood if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFood = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFood).toEqual(new Food());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Food })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFood = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFood).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
