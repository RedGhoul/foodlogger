import { IFoodEntry } from 'app/entities/food-entry/food-entry.model';

export interface IFood {
  id?: number;
  name?: string;
  calories?: number;
  carbohydrates?: number;
  proteins?: number;
  fat?: number;
  sodium?: number;
  foodEntries?: IFoodEntry[] | null;
}

export class Food implements IFood {
  constructor(
    public id?: number,
    public name?: string,
    public calories?: number,
    public carbohydrates?: number,
    public proteins?: number,
    public fat?: number,
    public sodium?: number,
    public foodEntries?: IFoodEntry[] | null
  ) {}
}

export function getFoodIdentifier(food: IFood): number | undefined {
  return food.id;
}
