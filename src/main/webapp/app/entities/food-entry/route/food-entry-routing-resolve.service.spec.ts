jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFoodEntry, FoodEntry } from '../food-entry.model';
import { FoodEntryService } from '../service/food-entry.service';

import { FoodEntryRoutingResolveService } from './food-entry-routing-resolve.service';

describe('Service Tests', () => {
  describe('FoodEntry routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FoodEntryRoutingResolveService;
    let service: FoodEntryService;
    let resultFoodEntry: IFoodEntry | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FoodEntryRoutingResolveService);
      service = TestBed.inject(FoodEntryService);
      resultFoodEntry = undefined;
    });

    describe('resolve', () => {
      it('should return IFoodEntry returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFoodEntry = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFoodEntry).toEqual({ id: 123 });
      });

      it('should return new IFoodEntry if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFoodEntry = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFoodEntry).toEqual(new FoodEntry());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FoodEntry })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFoodEntry = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFoodEntry).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
