import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFood, Food } from '../food.model';
import { FoodService } from '../service/food.service';

@Component({
  selector: 'jhi-food-update',
  templateUrl: './food-update.component.html',
})
export class FoodUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(2)]],
    calories: [null, [Validators.required]],
    carbohydrates: [null, [Validators.required]],
    proteins: [null, [Validators.required]],
    fat: [null, [Validators.required]],
    sodium: [null, [Validators.required]],
  });

  constructor(protected foodService: FoodService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ food }) => {
      this.updateForm(food);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const food = this.createFromForm();
    if (food.id !== undefined) {
      this.subscribeToSaveResponse(this.foodService.update(food));
    } else {
      this.subscribeToSaveResponse(this.foodService.create(food));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFood>>): void {
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

  protected updateForm(food: IFood): void {
    this.editForm.patchValue({
      id: food.id,
      name: food.name,
      calories: food.calories,
      carbohydrates: food.carbohydrates,
      proteins: food.proteins,
      fat: food.fat,
      sodium: food.sodium,
    });
  }

  protected createFromForm(): IFood {
    return {
      ...new Food(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      calories: this.editForm.get(['calories'])!.value,
      carbohydrates: this.editForm.get(['carbohydrates'])!.value,
      proteins: this.editForm.get(['proteins'])!.value,
      fat: this.editForm.get(['fat'])!.value,
      sodium: this.editForm.get(['sodium'])!.value,
    };
  }
}
