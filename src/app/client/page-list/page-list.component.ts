import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { environment } from 'src/environments/environment.development';
import { IClient } from '../interfaces/IClient';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})


export class PageListComponent {


  metaDataColumns: MetaDataColumn[] = [
    { field: "id", title: "ID" },
    { field: "name", title: "NOMBRE" },
    { field: "lastname", title: "APELLIDO" },
    { field: "email", title: "EMAIL" },
    { field: "phone", title: "TELÉFONO" },
  ]

  keypadButtons: KeypadButton[] = [
    { icon: "cloud_download", tooltip: "EXPORTAR", color: "accent", action: "DOWNLOAD" },
    { icon: "add", tooltip: "AGREGAR", color: "primary", action: "NEW" }
  ]

  private endpoint = 'clients';
  records: IClient[] = [];
  totalRecords = this.records.length

  currentPage = 0;

  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  //Inyeccion del servicio generico de las operaciones CRUD
  crudService = inject(CrudService<IClient, number>);

  constructor() {
    this.loadClients();
  }

  loadClients() {
    this.crudService.getAll(this.endpoint).subscribe({
      next: (res: IClient[]) => {
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
    this.crudService.delete(this.endpoint,id).subscribe(
      {
        next: () => {
          this.loadClients()
          this.showMessage('Registro eliminado')
        },
        error: err => (console.error(err))
      }
    )
  }

  openForm(row: IClient | null = null) {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row
    };
    const reference: MatDialogRef<FormComponent> = this.dialog.open(FormComponent, options);

    reference.afterClosed().subscribe((response) => {
      if (!response) { return; }
      if (response.id) {
        this.crudService.update(this.endpoint, response.id, response).subscribe({
          next: () => {
            this.loadClients()
            this.showMessage('Registro actualizado')
          }
        });
      } else {
        this.crudService.create(this.endpoint, response).subscribe({
          next: () => {
            this.totalRecords = this.records.length;
            this.loadClients();
            this.showMessage('Registro exitoso');
          }
        })
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet("Lista de Clientes", "clientes", this.records);
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