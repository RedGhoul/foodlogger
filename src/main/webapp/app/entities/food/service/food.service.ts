import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFood, getFoodIdentifier } from '../food.model';

export type EntityResponseType = HttpResponse<IFood>;
export type EntityArrayResponseType = HttpResponse<IFood[]>;

@Injectable({ providedIn: 'root' })
export class FoodService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/foods');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(food: IFood): Observable<EntityResponseType> {
    return this.http.post<IFood>(this.resourceUrl, food, { observe: 'response' });
  }

  update(food: IFood): Observable<EntityResponseType> {
    return this.http.put<IFood>(`${this.resourceUrl}/${getFoodIdentifier(food) as number}`, food, { observe: 'response' });
  }

  partialUpdate(food: IFood): Observable<EntityResponseType> {
    return this.http.patch<IFood>(`${this.resourceUrl}/${getFoodIdentifier(food) as number}`, food, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFood>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFood[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFoodToCollectionIfMissing(foodCollection: IFood[], ...foodsToCheck: (IFood | null | undefined)[]): IFood[] {
    const foods: IFood[] = foodsToCheck.filter(isPresent);
    if (foods.length > 0) {
      const foodCollectionIdentifiers = foodCollection.map(foodItem => getFoodIdentifier(foodItem)!);
      const foodsToAdd = foods.filter(foodItem => {
        const foodIdentifier = getFoodIdentifier(foodItem);
        if (foodIdentifier == null || foodCollectionIdentifiers.includes(foodIdentifier)) {
          return false;
        }
        foodCollectionIdentifiers.push(foodIdentifier);
        return true;
      });
      return [...foodsToAdd, ...foodCollection];
    }
    return foodCollection;
  }
}
