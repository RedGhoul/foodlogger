jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { GoalWeightService } from '../service/goal-weight.service';
import { IGoalWeight, GoalWeight } from '../goal-weight.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { GoalWeightUpdateComponent } from './goal-weight-update.component';

describe('Component Tests', () => {
  describe('GoalWeight Management Update Component', () => {
    let comp: GoalWeightUpdateComponent;
    let fixture: ComponentFixture<GoalWeightUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let goalWeightService: GoalWeightService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GoalWeightUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(GoalWeightUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GoalWeightUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      goalWeightService = TestBed.inject(GoalWeightService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const goalWeight: IGoalWeight = { id: 456 };
        const user: IUser = { id: 60428 };
        goalWeight.user = user;

        const userCollection: IUser[] = [{ id: 22029 }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ goalWeight });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const goalWeight: IGoalWeight = { id: 456 };
        const user: IUser = { id: 18591 };
        goalWeight.user = user;

        activatedRoute.data = of({ goalWeight });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(goalWeight));
        expect(comp.usersSharedCollection).toContain(user);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<GoalWeight>>();
        const goalWeight = { id: 123 };
        jest.spyOn(goalWeightService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ goalWeight });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: goalWeight }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(goalWeightService.update).toHaveBeenCalledWith(goalWeight);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<GoalWeight>>();
        const goalWeight = new GoalWeight();
        jest.spyOn(goalWeightService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ goalWeight });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: goalWeight }));
        saveSubject.complete();

        // THEN
        expect(goalWeightService.create).toHaveBeenCalledWith(goalWeight);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<GoalWeight>>();
        const goalWeight = { id: 123 };
        jest.spyOn(goalWeightService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ goalWeight });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(goalWeightService.update).toHaveBeenCalledWith(goalWeight);
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
