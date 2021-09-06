import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';

export interface ICurrentWeight {
  id?: number;
  weight?: number;
  createdDate?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export class CurrentWeight implements ICurrentWeight {
  constructor(public id?: number, public weight?: number, public createdDate?: dayjs.Dayjs | null, public user?: IUser | null) {}
}

export function getCurrentWeightIdentifier(currentWeight: ICurrentWeight): number | undefined {
  return currentWeight.id;
}
