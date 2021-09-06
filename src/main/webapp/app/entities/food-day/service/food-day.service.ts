import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFoodDay, getFoodDayIdentifier } from '../food-day.model';

export type EntityResponseType = HttpResponse<IFoodDay>;
export type EntityArrayResponseType = HttpResponse<IFoodDay[]>;

@Injectable({ providedIn: 'root' })
export class FoodDayService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/food-days');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(foodDay: IFoodDay): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(foodDay);
    return this.http
      .post<IFoodDay>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(foodDay: IFoodDay): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(foodDay);
    return this.http
      .put<IFoodDay>(`${this.resourceUrl}/${getFoodDayIdentifier(foodDay) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(foodDay: IFoodDay): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(foodDay);
    return this.http
      .patch<IFoodDay>(`${this.resourceUrl}/${getFoodDayIdentifier(foodDay) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFoodDay>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFoodDay[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFoodDayToCollectionIfMissing(foodDayCollection: IFoodDay[], ...foodDaysToCheck: (IFoodDay | null | undefined)[]): IFoodDay[] {
    const foodDays: IFoodDay[] = foodDaysToCheck.filter(isPresent);
    if (foodDays.length > 0) {
      const foodDayCollectionIdentifiers = foodDayCollection.map(foodDayItem => getFoodDayIdentifier(foodDayItem)!);
      const foodDaysToAdd = foodDays.filter(foodDayItem => {
        const foodDayIdentifier = getFoodDayIdentifier(foodDayItem);
        if (foodDayIdentifier == null || foodDayCollectionIdentifiers.includes(foodDayIdentifier)) {
          return false;
        }
        foodDayCollectionIdentifiers.push(foodDayIdentifier);
        return true;
      });
      return [...foodDaysToAdd, ...foodDayCollection];
    }
    return foodDayCollection;
  }

  protected convertDateFromClient(foodDay: IFoodDay): IFoodDay {
    return Object.assign({}, foodDay, {
      createdDate: foodDay.createdDate?.isValid() ? foodDay.createdDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdDate = res.body.createdDate ? dayjs(res.body.createdDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((foodDay: IFoodDay) => {
        foodDay.createdDate = foodDay.createdDate ? dayjs(foodDay.createdDate) : undefined;
      });
    }
    return res;
  }
}
