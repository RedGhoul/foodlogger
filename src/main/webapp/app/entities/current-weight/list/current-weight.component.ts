import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICurrentWeight } from '../current-weight.model';
import { CurrentWeightService } from '../service/current-weight.service';
import { CurrentWeightDeleteDialogComponent } from '../delete/current-weight-delete-dialog.component';

@Component({
  selector: 'jhi-current-weight',
  templateUrl: './current-weight.component.html',
})
export class CurrentWeightComponent implements OnInit {
  currentWeights?: ICurrentWeight[];
  isLoading = false;

  constructor(protected currentWeightService: CurrentWeightService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.currentWeightService.query().subscribe(
      (res: HttpResponse<ICurrentWeight[]>) => {
        this.isLoading = false;
        this.currentWeights = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICurrentWeight): number {
    return item.id!;
  }

  delete(currentWeight: ICurrentWeight): void {
    const modalRef = this.modalService.open(CurrentWeightDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.currentWeight = currentWeight;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
