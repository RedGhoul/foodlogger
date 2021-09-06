import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { ActivityLevel } from 'app/entities/enumerations/activity-level.model';

export interface IAppUser {
  id?: number;
  bio?: string | null;
  createdDate?: dayjs.Dayjs | null;
  height?: number;
  workoutsPerWeek?: number | null;
  minutesPerWorkout?: number | null;
  dateOfBirth?: dayjs.Dayjs | null;
  activityLevel?: ActivityLevel | null;
  user?: IUser | null;
}

export class AppUser implements IAppUser {
  constructor(
    public id?: number,
    public bio?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public height?: number,
    public workoutsPerWeek?: number | null,
    public minutesPerWorkout?: number | null,
    public dateOfBirth?: dayjs.Dayjs | null,
    public activityLevel?: ActivityLevel | null,
    public user?: IUser | null
  ) {}
}

export function getAppUserIdentifier(appUser: IAppUser): number | undefined {
  return appUser.id;
}
