import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFoodEntry, FoodEntry } from '../food-entry.model';
import { FoodEntryService } from '../service/food-entry.service';
import { IFoodDay } from 'app/entities/food-day/food-day.model';
import { FoodDayService } from 'app/entities/food-day/service/food-day.service';
import { IFood } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';

@Component({
  selector: 'jhi-food-entry-update',
  templateUrl: './food-entry-update.component.html',
})
export class FoodEntryUpdateComponent implements OnInit {
  isSaving = false;

  foodDaysSharedCollection: IFoodDay[] = [];
  foodsSharedCollection: IFood[] = [];

  editForm = this.fb.group({
    id: [],
    mealtype: [],
    createdDate: [],
    foodDay: [],
    food: [],
  });

  constructor(
    protected foodEntryService: FoodEntryService,
    protected foodDayService: FoodDayService,
    protected foodService: FoodService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foodEntry }) => {
      this.updateForm(foodEntry);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const foodEntry = this.createFromForm();
    if (foodEntry.id !== undefined) {
      this.subscribeToSaveResponse(this.foodEntryService.update(foodEntry));
    } else {
      this.subscribeToSaveResponse(this.foodEntryService.create(foodEntry));
    }
  }

  trackFoodDayById(index: number, item: IFoodDay): number {
    return item.id!;
  }

  trackFoodById(index: number, item: IFood): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFoodEntry>>): void {
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

  protected updateForm(foodEntry: IFoodEntry): void {
    this.editForm.patchValue({
      id: foodEntry.id,
      mealtype: foodEntry.mealtype,
      createdDate: foodEntry.createdDate,
      foodDay: foodEntry.foodDay,
      food: foodEntry.food,
    });

    this.foodDaysSharedCollection = this.foodDayService.addFoodDayToCollectionIfMissing(this.foodDaysSharedCollection, foodEntry.foodDay);
    this.foodsSharedCollection = this.foodService.addFoodToCollectionIfMissing(this.foodsSharedCollection, foodEntry.food);
  }

  protected loadRelationshipsOptions(): void {
    this.foodDayService
      .query()
      .pipe(map((res: HttpResponse<IFoodDay[]>) => res.body ?? []))
      .pipe(
        map((foodDays: IFoodDay[]) => this.foodDayService.addFoodDayToCollectionIfMissing(foodDays, this.editForm.get('foodDay')!.value))
      )
      .subscribe((foodDays: IFoodDay[]) => (this.foodDaysSharedCollection = foodDays));

    this.foodService
      .query()
      .pipe(map((res: HttpResponse<IFood[]>) => res.body ?? []))
      .pipe(map((foods: IFood[]) => this.foodService.addFoodToCollectionIfMissing(foods, this.editForm.get('food')!.value)))
      .subscribe((foods: IFood[]) => (this.foodsSharedCollection = foods));
  }

  protected createFromForm(): IFoodEntry {
    return {
      ...new FoodEntry(),
      id: this.editForm.get(['id'])!.value,
      mealtype: this.editForm.get(['mealtype'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value,
      foodDay: this.editForm.get(['foodDay'])!.value,
      food: this.editForm.get(['food'])!.value,
    };
  }
}
