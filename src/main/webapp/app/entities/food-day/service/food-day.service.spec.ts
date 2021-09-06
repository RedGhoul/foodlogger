import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IFoodDay, FoodDay } from '../food-day.model';

import { FoodDayService } from './food-day.service';

describe('Service Tests', () => {
  describe('FoodDay Service', () => {
    let service: FoodDayService;
    let httpMock: HttpTestingController;
    let elemDefault: IFoodDay;
    let expectedResult: IFoodDay | IFoodDay[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FoodDayService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
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

      it('should create a FoodDay', () => {
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

        service.create(new FoodDay()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a FoodDay', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
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

      it('should partial update a FoodDay', () => {
        const patchObject = Object.assign(
          {
            createdDate: currentDate.format(DATE_FORMAT),
          },
          new FoodDay()
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

      it('should return a list of FoodDay', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
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

      it('should delete a FoodDay', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFoodDayToCollectionIfMissing', () => {
        it('should add a FoodDay to an empty array', () => {
          const foodDay: IFoodDay = { id: 123 };
          expectedResult = service.addFoodDayToCollectionIfMissing([], foodDay);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(foodDay);
        });

        it('should not add a FoodDay to an array that contains it', () => {
          const foodDay: IFoodDay = { id: 123 };
          const foodDayCollection: IFoodDay[] = [
            {
              ...foodDay,
            },
            { id: 456 },
          ];
          expectedResult = service.addFoodDayToCollectionIfMissing(foodDayCollection, foodDay);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a FoodDay to an array that doesn't contain it", () => {
          const foodDay: IFoodDay = { id: 123 };
          const foodDayCollection: IFoodDay[] = [{ id: 456 }];
          expectedResult = service.addFoodDayToCollectionIfMissing(foodDayCollection, foodDay);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(foodDay);
        });

        it('should add only unique FoodDay to an array', () => {
          const foodDayArray: IFoodDay[] = [{ id: 123 }, { id: 456 }, { id: 35289 }];
          const foodDayCollection: IFoodDay[] = [{ id: 123 }];
          expectedResult = service.addFoodDayToCollectionIfMissing(foodDayCollection, ...foodDayArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const foodDay: IFoodDay = { id: 123 };
          const foodDay2: IFoodDay = { id: 456 };
          expectedResult = service.addFoodDayToCollectionIfMissing([], foodDay, foodDay2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(foodDay);
          expect(expectedResult).toContain(foodDay2);
        });

        it('should accept null and undefined values', () => {
          const foodDay: IFoodDay = { id: 123 };
          expectedResult = service.addFoodDayToCollectionIfMissing([], null, foodDay, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(foodDay);
        });

        it('should return initial array if no FoodDay is added', () => {
          const foodDayCollection: IFoodDay[] = [{ id: 123 }];
          expectedResult = service.addFoodDayToCollectionIfMissing(foodDayCollection, undefined, null);
          expect(expectedResult).toEqual(foodDayCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
