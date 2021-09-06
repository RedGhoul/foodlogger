import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFoodEntry, getFoodEntryIdentifier } from '../food-entry.model';

export type EntityResponseType = HttpResponse<IFoodEntry>;
export type EntityArrayResponseType = HttpResponse<IFoodEntry[]>;

@Injectable({ providedIn: 'root' })
export class FoodEntryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/food-entries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(foodEntry: IFoodEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(foodEntry);
    return this.http
      .post<IFoodEntry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(foodEntry: IFoodEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(foodEntry);
    return this.http
      .put<IFoodEntry>(`${this.resourceUrl}/${getFoodEntryIdentifier(foodEntry) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(foodEntry: IFoodEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(foodEntry);
    return this.http
      .patch<IFoodEntry>(`${this.resourceUrl}/${getFoodEntryIdentifier(foodEntry) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFoodEntry>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFoodEntry[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFoodEntryToCollectionIfMissing(
    foodEntryCollection: IFoodEntry[],
    ...foodEntriesToCheck: (IFoodEntry | null | undefined)[]
  ): IFoodEntry[] {
    const foodEntries: IFoodEntry[] = foodEntriesToCheck.filter(isPresent);
    if (foodEntries.length > 0) {
      const foodEntryCollectionIdentifiers = foodEntryCollection.map(foodEntryItem => getFoodEntryIdentifier(foodEntryItem)!);
      const foodEntriesToAdd = foodEntries.filter(foodEntryItem => {
        const foodEntryIdentifier = getFoodEntryIdentifier(foodEntryItem);
        if (foodEntryIdentifier == null || foodEntryCollectionIdentifiers.includes(foodEntryIdentifier)) {
          return false;
        }
        foodEntryCollectionIdentifiers.push(foodEntryIdentifier);
        return true;
      });
      return [...foodEntriesToAdd, ...foodEntryCollection];
    }
    return foodEntryCollection;
  }

  protected convertDateFromClient(foodEntry: IFoodEntry): IFoodEntry {
    return Object.assign({}, foodEntry, {
      createdDate: foodEntry.createdDate?.isValid() ? foodEntry.createdDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((foodEntry: IFoodEntry) => {
        foodEntry.createdDate = foodEntry.createdDate ? dayjs(foodEntry.createdDate) : undefined;
      });
    }
    return res;
  }
}
