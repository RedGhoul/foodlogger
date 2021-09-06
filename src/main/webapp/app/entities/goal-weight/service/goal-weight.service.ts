import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGoalWeight, getGoalWeightIdentifier } from '../goal-weight.model';

export type EntityResponseType = HttpResponse<IGoalWeight>;
export type EntityArrayResponseType = HttpResponse<IGoalWeight[]>;

@Injectable({ providedIn: 'root' })
export class GoalWeightService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/goal-weights');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(goalWeight: IGoalWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(goalWeight);
    return this.http
      .post<IGoalWeight>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(goalWeight: IGoalWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(goalWeight);
    return this.http
      .put<IGoalWeight>(`${this.resourceUrl}/${getGoalWeightIdentifier(goalWeight) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(goalWeight: IGoalWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(goalWeight);
    return this.http
      .patch<IGoalWeight>(`${this.resourceUrl}/${getGoalWeightIdentifier(goalWeight) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IGoalWeight>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IGoalWeight[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGoalWeightToCollectionIfMissing(
    goalWeightCollection: IGoalWeight[],
    ...goalWeightsToCheck: (IGoalWeight | null | undefined)[]
  ): IGoalWeight[] {
    const goalWeights: IGoalWeight[] = goalWeightsToCheck.filter(isPresent);
    if (goalWeights.length > 0) {
      const goalWeightCollectionIdentifiers = goalWeightCollection.map(goalWeightItem => getGoalWeightIdentifier(goalWeightItem)!);
      const goalWeightsToAdd = goalWeights.filter(goalWeightItem => {
        const goalWeightIdentifier = getGoalWeightIdentifier(goalWeightItem);
        if (goalWeightIdentifier == null || goalWeightCollectionIdentifiers.includes(goalWeightIdentifier)) {
          return false;
        }
        goalWeightCollectionIdentifiers.push(goalWeightIdentifier);
        return true;
      });
      return [...goalWeightsToAdd, ...goalWeightCollection];
    }
    return goalWeightCollection;
  }

  protected convertDateFromClient(goalWeight: IGoalWeight): IGoalWeight {
    return Object.assign({}, goalWeight, {
      createdDate: goalWeight.createdDate?.isValid() ? goalWeight.createdDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((goalWeight: IGoalWeight) => {
        goalWeight.createdDate = goalWeight.createdDate ? dayjs(goalWeight.createdDate) : undefined;
      });
    }
    return res;
  }
}
