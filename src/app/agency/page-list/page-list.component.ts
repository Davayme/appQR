import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { environment } from 'src/environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgencyService } from '../services/agency.service';
import { IAgency } from '../interfaces/agency-interface';


@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})

export class PageListComponent {
  metaDataColumns: MetaDataColumn[] = [
    { field: "id", title: "ID" },
    { field: "name", title: "AGENCIA" },
    { field: "address", title: "DIRECCIÓN" }
  ];
  keypadButtons: KeypadButton[] = [
    { icon: "cloud_download", tooltip: "EXPORTAR", color: "accent", action: "DOWNLOAD" },
    { icon: "add", tooltip: "AGREGAR", color: "primary", action: "NEW" }
  ];
  records: IAgency[] = [];
  totalRecords = this.records.length;


  currentPage = 0;

  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  agencySrv = inject(AgencyService)

  constructor() {
    this.loadAgencies();
  }

  loadAgencies() {
    this.agencySrv.getAgencies().subscribe({
      next: (res: IAgency[]) => {
        this.records = res;
        this.totalRecords = res.length;
        this.changePage(this.currentPage);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  delete(id: number) {

    this.agencySrv.delete(id).subscribe(
      {
        next: () => {
          this.loadAgencies()
          this.showMessage('Registro eliminado')
        },
        error: err => (console.error(err))
      }
    )
  }

  openForm(row: IAgency | null = null) {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row
    };
    const reference: MatDialogRef<FormComponent> = this.dialog.open(FormComponent, options);

    reference.afterClosed().subscribe((response) => {
      if (!response) { return; }
      if (response.id) {
        this.agencySrv.updateAgency(response.id, response).subscribe({
          next: () => {
            this.loadAgencies()
            this.showMessage('Registro actualizado')
          }
        });
      } else {
        console.log(response);

        this.agencySrv.createAgency(response).subscribe({
          next: () => {
            this.loadAgencies()
            this.totalRecords = this.records.length;
            this.loadAgencies();
            this.showMessage('Registro exitoso');
          }

        })
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet("Lista de Agencias", "agencias", this.records);
        break;
      case 'NEW':
        this.openForm();
        break;
    }
  }

  showBottomSheet(title: string, fileName: string, data: any) {
    this.bottomSheet.open(DownloadComponent);
  }

  showMessage(message: string, duration: number = 5000) {
    this.snackBar.open(message, '', { duration });
  }

  changePage(page: number) {
    const pageSize = environment.PAGE_SIZE;
    const skip = pageSize * page;
    this.records = this.records.slice(skip, skip + pageSize);
    this.currentPage = page;
  }


}