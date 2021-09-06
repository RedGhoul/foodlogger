import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IGoalWeight, GoalWeight } from '../goal-weight.model';
import { GoalWeightService } from '../service/goal-weight.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-goal-weight-update',
  templateUrl: './goal-weight-update.component.html',
})
export class GoalWeightUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    weight: [null, [Validators.required]],
    createdDate: [],
    user: [],
  });

  constructor(
    protected goalWeightService: GoalWeightService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ goalWeight }) => {
      this.updateForm(goalWeight);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const goalWeight = this.createFromForm();
    if (goalWeight.id !== undefined) {
      this.subscribeToSaveResponse(this.goalWeightService.update(goalWeight));
    } else {
      this.subscribeToSaveResponse(this.goalWeightService.create(goalWeight));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGoalWeight>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(goalWeight: IGoalWeight): void {
    this.editForm.patchValue({
      id: goalWeight.id,
      weight: goalWeight.weight,
      createdDate: goalWeight.createdDate,
      user: goalWeight.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, goalWeight.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IGoalWeight {
    return {
      ...new GoalWeight(),
      id: this.editForm.get(['id'])!.value,
      weight: this.editForm.get(['weight'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
