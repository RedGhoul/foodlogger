import * as dayjs from 'dayjs';
import { IFoodDay } from 'app/entities/food-day/food-day.model';
import { IFood } from 'app/entities/food/food.model';
import { MealType } from 'app/entities/enumerations/meal-type.model';

export interface IFoodEntry {
  id?: number;
  mealtype?: MealType | null;
  createdDate?: dayjs.Dayjs | null;
  foodDay?: IFoodDay | null;
  food?: IFood | null;
}

export class FoodEntry implements IFoodEntry {
  constructor(
    public id?: number,
    public mealtype?: MealType | null,
    public createdDate?: dayjs.Dayjs | null,
    public foodDay?: IFoodDay | null,
    public food?: IFood | null
  ) {}
}

export function getFoodEntryIdentifier(foodEntry: IFoodEntry): number | undefined {
  return foodEntry.id;
}
