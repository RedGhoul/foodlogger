import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'current-weight',
        data: { pageTitle: 'CurrentWeights' },
        loadChildren: () => import('./current-weight/current-weight.module').then(m => m.CurrentWeightModule),
      },
      {
        path: 'goal-weight',
        data: { pageTitle: 'GoalWeights' },
        loadChildren: () => import('./goal-weight/goal-weight.module').then(m => m.GoalWeightModule),
      },
      {
        path: 'food',
        data: { pageTitle: 'Foods' },
        loadChildren: () => import('./food/food.module').then(m => m.FoodModule),
      },
      {
        path: 'food-entry',
        data: { pageTitle: 'FoodEntries' },
        loadChildren: () => import('./food-entry/food-entry.module').then(m => m.FoodEntryModule),
      },
      {
        path: 'food-day',
        data: { pageTitle: 'FoodDays' },
        loadChildren: () => import('./food-day/food-day.module').then(m => m.FoodDayModule),
      },
      {
        path: 'app-user',
        data: { pageTitle: 'AppUsers' },
        loadChildren: () => import('./app-user/app-user.module').then(m => m.AppUserModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
