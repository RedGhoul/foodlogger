import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IGoalWeight, GoalWeight } from '../goal-weight.model';

import { GoalWeightService } from './goal-weight.service';

describe('Service Tests', () => {
  describe('GoalWeight Service', () => {
    let service: GoalWeightService;
    let httpMock: HttpTestingController;
    let elemDefault: IGoalWeight;
    let expectedResult: IGoalWeight | IGoalWeight[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(GoalWeightService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        weight: 0,
        createdDate: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            createdDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a GoalWeight', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            createdDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdDate: currentDate,
          },
          returnedFromService
        );

        service.create(new GoalWeight()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a GoalWeight', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            weight: 1,
            createdDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a GoalWeight', () => {
        const patchObject = Object.assign(
          {
            weight: 1,
          },
          new GoalWeight()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            createdDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of GoalWeight', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            weight: 1,
            createdDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a GoalWeight', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addGoalWeightToCollectionIfMissing', () => {
        it('should add a GoalWeight to an empty array', () => {
          const goalWeight: IGoalWeight = { id: 123 };
          expectedResult = service.addGoalWeightToCollectionIfMissing([], goalWeight);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(goalWeight);
        });

        it('should not add a GoalWeight to an array that contains it', () => {
          const goalWeight: IGoalWeight = { id: 123 };
          const goalWeightCollection: IGoalWeight[] = [
            {
              ...goalWeight,
            },
            { id: 456 },
          ];
          expectedResult = service.addGoalWeightToCollectionIfMissing(goalWeightCollection, goalWeight);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a GoalWeight to an array that doesn't contain it", () => {
          const goalWeight: IGoalWeight = { id: 123 };
          const goalWeightCollection: IGoalWeight[] = [{ id: 456 }];
          expectedResult = service.addGoalWeightToCollectionIfMissing(goalWeightCollection, goalWeight);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(goalWeight);
        });

        it('should add only unique GoalWeight to an array', () => {
          const goalWeightArray: IGoalWeight[] = [{ id: 123 }, { id: 456 }, { id: 22227 }];
          const goalWeightCollection: IGoalWeight[] = [{ id: 123 }];
          expectedResult = service.addGoalWeightToCollectionIfMissing(goalWeightCollection, ...goalWeightArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const goalWeight: IGoalWeight = { id: 123 };
          const goalWeight2: IGoalWeight = { id: 456 };
          expectedResult = service.addGoalWeightToCollectionIfMissing([], goalWeight, goalWeight2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(goalWeight);
          expect(expectedResult).toContain(goalWeight2);
        });

        it('should accept null and undefined values', () => {
          const goalWeight: IGoalWeight = { id: 123 };
          expectedResult = service.addGoalWeightToCollectionIfMissing([], null, goalWeight, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(goalWeight);
        });

        it('should return initial array if no GoalWeight is added', () => {
          const goalWeightCollection: IGoalWeight[] = [{ id: 123 }];
          expectedResult = service.addGoalWeightToCollectionIfMissing(goalWeightCollection, undefined, null);
          expect(expectedResult).toEqual(goalWeightCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
