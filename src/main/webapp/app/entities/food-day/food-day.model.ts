import * as dayjs from 'dayjs';
import { IFoodEntry } from 'app/entities/food-entry/food-entry.model';
import { IUser } from 'app/entities/user/user.model';

export interface IFoodDay {
  id?: number;
  createdDate?: dayjs.Dayjs | null;
  foodEntries?: IFoodEntry[] | null;
  user?: IUser | null;
}

export class FoodDay implements IFoodDay {
  constructor(
    public id?: number,
    public createdDate?: dayjs.Dayjs | null,
    public foodEntries?: IFoodEntry[] | null,
    public user?: IUser | null
  ) {}
}

export function getFoodDayIdentifier(foodDay: IFoodDay): number | undefined {
  return foodDay.id;
}
