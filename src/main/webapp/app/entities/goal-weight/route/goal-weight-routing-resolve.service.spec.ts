jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IGoalWeight, GoalWeight } from '../goal-weight.model';
import { GoalWeightService } from '../service/goal-weight.service';

import { GoalWeightRoutingResolveService } from './goal-weight-routing-resolve.service';

describe('Service Tests', () => {
  describe('GoalWeight routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: GoalWeightRoutingResolveService;
    let service: GoalWeightService;
    let resultGoalWeight: IGoalWeight | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(GoalWeightRoutingResolveService);
      service = TestBed.inject(GoalWeightService);
      resultGoalWeight = undefined;
    });

    describe('resolve', () => {
      it('should return IGoalWeight returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGoalWeight = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultGoalWeight).toEqual({ id: 123 });
      });

      it('should return new IGoalWeight if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGoalWeight = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultGoalWeight).toEqual(new GoalWeight());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as GoalWeight })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGoalWeight = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultGoalWeight).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
