import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICurrentWeight, CurrentWeight } from '../current-weight.model';
import { CurrentWeightService } from '../service/current-weight.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-current-weight-update',
  templateUrl: './current-weight-update.component.html',
})
export class CurrentWeightUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    weight: [null, [Validators.required]],
    createdDate: [],
    user: [],
  });

  constructor(
    protected currentWeightService: CurrentWeightService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ currentWeight }) => {
      this.updateForm(currentWeight);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const currentWeight = this.createFromForm();
    if (currentWeight.id !== undefined) {
      this.subscribeToSaveResponse(this.currentWeightService.update(currentWeight));
    } else {
      this.subscribeToSaveResponse(this.currentWeightService.create(currentWeight));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICurrentWeight>>): void {
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

  protected updateForm(currentWeight: ICurrentWeight): void {
    this.editForm.patchValue({
      id: currentWeight.id,
      weight: currentWeight.weight,
      createdDate: currentWeight.createdDate,
      user: currentWeight.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, currentWeight.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): ICurrentWeight {
    return {
      ...new CurrentWeight(),
      id: this.editForm.get(['id'])!.value,
      weight: this.editForm.get(['weight'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
