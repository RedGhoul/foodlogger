import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';

export interface IGoalWeight {
  id?: number;
  weight?: number;
  createdDate?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export class GoalWeight implements IGoalWeight {
  constructor(public id?: number, public weight?: number, public createdDate?: dayjs.Dayjs | null, public user?: IUser | null) {}
}

export function getGoalWeightIdentifier(goalWeight: IGoalWeight): number | undefined {
  return goalWeight.id;
}
