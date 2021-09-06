jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FoodService } from '../service/food.service';
import { IFood, Food } from '../food.model';

import { FoodUpdateComponent } from './food-update.component';

describe('Component Tests', () => {
  describe('Food Management Update Component', () => {
    let comp: FoodUpdateComponent;
    let fixture: ComponentFixture<FoodUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let foodService: FoodService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FoodUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FoodUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FoodUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      foodService = TestBed.inject(FoodService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const food: IFood = { id: 456 };

        activatedRoute.data = of({ food });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(food));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Food>>();
        const food = { id: 123 };
        jest.spyOn(foodService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ food });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: food }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(foodService.update).toHaveBeenCalledWith(food);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Food>>();
        const food = new Food();
        jest.spyOn(foodService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ food });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: food }));
        saveSubject.complete();

        // THEN
        expect(foodService.create).toHaveBeenCalledWith(food);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Food>>();
        const food = { id: 123 };
        jest.spyOn(foodService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ food });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(foodService.update).toHaveBeenCalledWith(food);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
