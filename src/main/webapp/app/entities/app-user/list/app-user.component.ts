import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppUser } from '../app-user.model';
import { AppUserService } from '../service/app-user.service';
import { AppUserDeleteDialogComponent } from '../delete/app-user-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-app-user',
  templateUrl: './app-user.component.html',
})
export class AppUserComponent implements OnInit {
  appUsers?: IAppUser[];
  isLoading = false;

  constructor(protected appUserService: AppUserService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.appUserService.query().subscribe(
      (res: HttpResponse<IAppUser[]>) => {
        this.isLoading = false;
        this.appUsers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAppUser): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(appUser: IAppUser): void {
    const modalRef = this.modalService.open(AppUserDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.appUser = appUser;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
