jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FoodDayService } from '../service/food-day.service';
import { IFoodDay, FoodDay } from '../food-day.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { FoodDayUpdateComponent } from './food-day-update.component';

describe('Component Tests', () => {
  describe('FoodDay Management Update Component', () => {
    let comp: FoodDayUpdateComponent;
    let fixture: ComponentFixture<FoodDayUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let foodDayService: FoodDayService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FoodDayUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FoodDayUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FoodDayUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      foodDayService = TestBed.inject(FoodDayService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const foodDay: IFoodDay = { id: 456 };
        const user: IUser = { id: 31250 };
        foodDay.user = user;

        const userCollection: IUser[] = [{ id: 66782 }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ foodDay });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const foodDay: IFoodDay = { id: 456 };
        const user: IUser = { id: 96428 };
        foodDay.user = user;

        activatedRoute.data = of({ foodDay });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(foodDay));
        expect(comp.usersSharedCollection).toContain(user);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<FoodDay>>();
        const foodDay = { id: 123 };
        jest.spyOn(foodDayService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ foodDay });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: foodDay }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(foodDayService.update).toHaveBeenCalledWith(foodDay);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<FoodDay>>();
        const foodDay = new FoodDay();
        jest.spyOn(foodDayService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ foodDay });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: foodDay }));
        saveSubject.complete();

        // THEN
        expect(foodDayService.create).toHaveBeenCalledWith(foodDay);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<FoodDay>>();
        const foodDay = { id: 123 };
        jest.spyOn(foodDayService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ foodDay });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(foodDayService.update).toHaveBeenCalledWith(foodDay);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
