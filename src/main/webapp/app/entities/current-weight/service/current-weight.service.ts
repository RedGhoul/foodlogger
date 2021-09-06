import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICurrentWeight, getCurrentWeightIdentifier } from '../current-weight.model';

export type EntityResponseType = HttpResponse<ICurrentWeight>;
export type EntityArrayResponseType = HttpResponse<ICurrentWeight[]>;

@Injectable({ providedIn: 'root' })
export class CurrentWeightService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/current-weights');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(currentWeight: ICurrentWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(currentWeight);
    return this.http
      .post<ICurrentWeight>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(currentWeight: ICurrentWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(currentWeight);
    return this.http
      .put<ICurrentWeight>(`${this.resourceUrl}/${getCurrentWeightIdentifier(currentWeight) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(currentWeight: ICurrentWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(currentWeight);
    return this.http
      .patch<ICurrentWeight>(`${this.resourceUrl}/${getCurrentWeightIdentifier(currentWeight) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICurrentWeight>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICurrentWeight[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCurrentWeightToCollectionIfMissing(
    currentWeightCollection: ICurrentWeight[],
    ...currentWeightsToCheck: (ICurrentWeight | null | undefined)[]
  ): ICurrentWeight[] {
    const currentWeights: ICurrentWeight[] = currentWeightsToCheck.filter(isPresent);
    if (currentWeights.length > 0) {
      const currentWeightCollectionIdentifiers = currentWeightCollection.map(
        currentWeightItem => getCurrentWeightIdentifier(currentWeightItem)!
      );
      const currentWeightsToAdd = currentWeights.filter(currentWeightItem => {
        const currentWeightIdentifier = getCurrentWeightIdentifier(currentWeightItem);
        if (currentWeightIdentifier == null || currentWeightCollectionIdentifiers.includes(currentWeightIdentifier)) {
          return false;
        }
        currentWeightCollectionIdentifiers.push(currentWeightIdentifier);
        return true;
      });
      return [...currentWeightsToAdd, ...currentWeightCollection];
    }
    return currentWeightCollection;
  }

  protected convertDateFromClient(currentWeight: ICurrentWeight): ICurrentWeight {
    return Object.assign({}, currentWeight, {
      createdDate: currentWeight.createdDate?.isValid() ? currentWeight.createdDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((currentWeight: ICurrentWeight) => {
        currentWeight.createdDate = currentWeight.createdDate ? dayjs(currentWeight.createdDate) : undefined;
      });
    }
    return res;
  }
}
