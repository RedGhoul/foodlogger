import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ICurrentWeight, CurrentWeight } from '../current-weight.model';

import { CurrentWeightService } from './current-weight.service';

describe('Service Tests', () => {
  describe('CurrentWeight Service', () => {
    let service: CurrentWeightService;
    let httpMock: HttpTestingController;
    let elemDefault: ICurrentWeight;
    let expectedResult: ICurrentWeight | ICurrentWeight[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CurrentWeightService);
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

      it('should create a CurrentWeight', () => {
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

        service.create(new CurrentWeight()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a CurrentWeight', () => {
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

      it('should partial update a CurrentWeight', () => {
        const patchObject = Object.assign({}, new CurrentWeight());

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

      it('should return a list of CurrentWeight', () => {
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

      it('should delete a CurrentWeight', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCurrentWeightToCollectionIfMissing', () => {
        it('should add a CurrentWeight to an empty array', () => {
          const currentWeight: ICurrentWeight = { id: 123 };
          expectedResult = service.addCurrentWeightToCollectionIfMissing([], currentWeight);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(currentWeight);
        });

        it('should not add a CurrentWeight to an array that contains it', () => {
          const currentWeight: ICurrentWeight = { id: 123 };
          const currentWeightCollection: ICurrentWeight[] = [
            {
              ...currentWeight,
            },
            { id: 456 },
          ];
          expectedResult = service.addCurrentWeightToCollectionIfMissing(currentWeightCollection, currentWeight);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a CurrentWeight to an array that doesn't contain it", () => {
          const currentWeight: ICurrentWeight = { id: 123 };
          const currentWeightCollection: ICurrentWeight[] = [{ id: 456 }];
          expectedResult = service.addCurrentWeightToCollectionIfMissing(currentWeightCollection, currentWeight);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(currentWeight);
        });

        it('should add only unique CurrentWeight to an array', () => {
          const currentWeightArray: ICurrentWeight[] = [{ id: 123 }, { id: 456 }, { id: 48711 }];
          const currentWeightCollection: ICurrentWeight[] = [{ id: 123 }];
          expectedResult = service.addCurrentWeightToCollectionIfMissing(currentWeightCollection, ...currentWeightArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const currentWeight: ICurrentWeight = { id: 123 };
          const currentWeight2: ICurrentWeight = { id: 456 };
          expectedResult = service.addCurrentWeightToCollectionIfMissing([], currentWeight, currentWeight2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(currentWeight);
          expect(expectedResult).toContain(currentWeight2);
        });

        it('should accept null and undefined values', () => {
          const currentWeight: ICurrentWeight = { id: 123 };
          expectedResult = service.addCurrentWeightToCollectionIfMissing([], null, currentWeight, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(currentWeight);
        });

        it('should return initial array if no CurrentWeight is added', () => {
          const currentWeightCollection: ICurrentWeight[] = [{ id: 123 }];
          expectedResult = service.addCurrentWeightToCollectionIfMissing(currentWeightCollection, undefined, null);
          expect(expectedResult).toEqual(currentWeightCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
