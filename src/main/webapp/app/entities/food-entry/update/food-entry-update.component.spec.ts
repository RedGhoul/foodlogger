jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FoodEntryService } from '../service/food-entry.service';
import { IFoodEntry, FoodEntry } from '../food-entry.model';
import { IFoodDay } from 'app/entities/food-day/food-day.model';
import { FoodDayService } from 'app/entities/food-day/service/food-day.service';
import { IFood } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';

import { FoodEntryUpdateComponent } from './food-entry-update.component';

describe('Component Tests', () => {
  describe('FoodEntry Management Update Component', () => {
    let comp: FoodEntryUpdateComponent;
    let fixture: ComponentFixture<FoodEntryUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let foodEntryService: FoodEntryService;
    let foodDayService: FoodDayService;
    let foodService: FoodService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FoodEntryUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FoodEntryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FoodEntryUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      foodEntryService = TestBed.inject(FoodEntryService);
      foodDayService = TestBed.inject(FoodDayService);
      foodService = TestBed.inject(FoodService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call FoodDay query and add missing value', () => {
        const foodEntry: IFoodEntry = { id: 456 };
        const foodDay: IFoodDay = { id: 77894 };
        foodEntry.foodDay = foodDay;

        const foodDayCollection: IFoodDay[] = [{ id: 40654 }];
        jest.spyOn(foodDayService, 'query').mockReturnValue(of(new HttpResponse({ body: foodDayCollection })));
        const additionalFoodDays = [foodDay];
        const expectedCollection: IFoodDay[] = [...additionalFoodDays, ...foodDayCollection];
        jest.spyOn(foodDayService, 'addFoodDayToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ foodEntry });
        comp.ngOnInit();

        expect(foodDayService.query).toHaveBeenCalled();
        expect(foodDayService.addFoodDayToCollectionIfMissing).toHaveBeenCalledWith(foodDayCollection, ...additionalFoodDays);
        expect(comp.foodDaysSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Food query and add missing value', () => {
        const foodEntry: IFoodEntry = { id: 456 };
        const food: IFood = { id: 2449 };
        foodEntry.food = food;

        const foodCollection: IFood[] = [{ id: 81319 }];
        jest.spyOn(foodService, 'query').mockReturnValue(of(new HttpResponse({ body: foodCollection })));
        const additionalFoods = [food];
        const expectedCollection: IFood[] = [...additionalFoods, ...foodCollection];
        jest.spyOn(foodService, 'addFoodToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ foodEntry });
        comp.ngOnInit();

        expect(foodService.query).toHaveBeenCalled();
        expect(foodService.addFoodToCollectionIfMissing).toHaveBeenCalledWith(foodCollection, ...additionalFoods);
        expect(comp.foodsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const foodEntry: IFoodEntry = { id: 456 };
        const foodDay: IFoodDay = { id: 53799 };
        foodEntry.foodDay = foodDay;
        const food: IFood = { id: 73396 };
        foodEntry.food = food;

        activatedRoute.data = of({ foodEntry });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(foodEntry));
        expect(comp.foodDaysSharedCollection).toContain(foodDay);
        expect(comp.foodsSharedCollection).toContain(food);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<FoodEntry>>();
        const foodEntry = { id: 123 };
        jest.spyOn(foodEntryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ foodEntry });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: foodEntry }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(foodEntryService.update).toHaveBeenCalledWith(foodEntry);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<FoodEntry>>();
        const foodEntry = new FoodEntry();
        jest.spyOn(foodEntryService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ foodEntry });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: foodEntry }));
        saveSubject.complete();

        // THEN
        expect(foodEntryService.create).toHaveBeenCalledWith(foodEntry);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<FoodEntry>>();
        const foodEntry = { id: 123 };
        jest.spyOn(foodEntryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ foodEntry });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(foodEntryService.update).toHaveBeenCalledWith(foodEntry);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackFoodDayById', () => {
        it('Should return tracked FoodDay primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackFoodDayById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackFoodById', () => {
        it('Should return tracked Food primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackFoodById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
