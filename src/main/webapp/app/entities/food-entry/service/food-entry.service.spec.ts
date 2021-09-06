import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { MealType } from 'app/entities/enumerations/meal-type.model';
import { IFoodEntry, FoodEntry } from '../food-entry.model';

import { FoodEntryService } from './food-entry.service';

describe('Service Tests', () => {
  describe('FoodEntry Service', () => {
    let service: FoodEntryService;
    let httpMock: HttpTestingController;
    let elemDefault: IFoodEntry;
    let expectedResult: IFoodEntry | IFoodEntry[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FoodEntryService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        mealtype: MealType.Lunch,
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

      it('should create a FoodEntry', () => {
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

        service.create(new FoodEntry()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a FoodEntry', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            mealtype: 'BBBBBB',
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

      it('should partial update a FoodEntry', () => {
        const patchObject = Object.assign({}, new FoodEntry());

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

      it('should return a list of FoodEntry', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            mealtype: 'BBBBBB',
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

      it('should delete a FoodEntry', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFoodEntryToCollectionIfMissing', () => {
        it('should add a FoodEntry to an empty array', () => {
          const foodEntry: IFoodEntry = { id: 123 };
          expectedResult = service.addFoodEntryToCollectionIfMissing([], foodEntry);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(foodEntry);
        });

        it('should not add a FoodEntry to an array that contains it', () => {
          const foodEntry: IFoodEntry = { id: 123 };
          const foodEntryCollection: IFoodEntry[] = [
            {
              ...foodEntry,
            },
            { id: 456 },
          ];
          expectedResult = service.addFoodEntryToCollectionIfMissing(foodEntryCollection, foodEntry);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a FoodEntry to an array that doesn't contain it", () => {
          const foodEntry: IFoodEntry = { id: 123 };
          const foodEntryCollection: IFoodEntry[] = [{ id: 456 }];
          expectedResult = service.addFoodEntryToCollectionIfMissing(foodEntryCollection, foodEntry);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(foodEntry);
        });

        it('should add only unique FoodEntry to an array', () => {
          const foodEntryArray: IFoodEntry[] = [{ id: 123 }, { id: 456 }, { id: 98186 }];
          const foodEntryCollection: IFoodEntry[] = [{ id: 123 }];
          expectedResult = service.addFoodEntryToCollectionIfMissing(foodEntryCollection, ...foodEntryArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const foodEntry: IFoodEntry = { id: 123 };
          const foodEntry2: IFoodEntry = { id: 456 };
          expectedResult = service.addFoodEntryToCollectionIfMissing([], foodEntry, foodEntry2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(foodEntry);
          expect(expectedResult).toContain(foodEntry2);
        });

        it('should accept null and undefined values', () => {
          const foodEntry: IFoodEntry = { id: 123 };
          expectedResult = service.addFoodEntryToCollectionIfMissing([], null, foodEntry, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(foodEntry);
        });

        it('should return initial array if no FoodEntry is added', () => {
          const foodEntryCollection: IFoodEntry[] = [{ id: 123 }];
          expectedResult = service.addFoodEntryToCollectionIfMissing(foodEntryCollection, undefined, null);
          expect(expectedResult).toEqual(foodEntryCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
