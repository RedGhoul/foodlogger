import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFoodDay } from '../food-day.model';
import { FoodDayService } from '../service/food-day.service';
import { FoodDayDeleteDialogComponent } from '../delete/food-day-delete-dialog.component';

@Component({
  selector: 'jhi-food-day',
  templateUrl: './food-day.component.html',
})
export class FoodDayComponent implements OnInit {
  foodDays?: IFoodDay[];
  isLoading = false;

  constructor(protected foodDayService: FoodDayService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.foodDayService.query().subscribe(
      (res: HttpResponse<IFoodDay[]>) => {
        this.isLoading = false;
        this.foodDays = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFoodDay): number {
    return item.id!;
  }

  delete(foodDay: IFoodDay): void {
    const modalRef = this.modalService.open(FoodDayDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.foodDay = foodDay;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
