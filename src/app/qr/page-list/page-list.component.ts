import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { environment } from 'src/environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface IComplaint {
  id: number;
  id_client: number;
  id_employee: number;
  dateCreated: string;
  comentary: string;
}

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})
export class PageListComponent {
  data: IComplaint[] = [
    { id: 1, id_client: 101, id_employee: 201, dateCreated: '2024-01-01', comentary: 'El producto llegó dañado y no funciona correctamente.' },
  { id: 2, id_client: 102, id_employee: 202, dateCreated: '2024-01-02', comentary: 'El servicio de atención al cliente fue muy deficiente.' },
  { id: 3, id_client: 103, id_employee: 203, dateCreated: '2024-01-03', comentary: 'No recibí el producto que había pedido.' },
  { id: 4, id_client: 104, id_employee: 204, dateCreated: '2024-01-04', comentary: 'La entrega del producto se demoró mucho más de lo esperado.' },
  { id: 5, id_client: 105, id_employee: 205, dateCreated: '2024-01-05', comentary: 'El producto no coincide con la descripción en la página web.' },
  { id: 6, id_client: 106, id_employee: 206, dateCreated: '2024-01-06', comentary: 'Tuve problemas para instalar el software que compré.' },
  { id: 7, id_client: 107, id_employee: 207, dateCreated: '2024-01-07', comentary: 'El reembolso que solicité no ha sido procesado.' },
  { id: 8, id_client: 108, id_employee: 208, dateCreated: '2024-01-08', comentary: 'El producto dejó de funcionar después de una semana de uso.' },
  { id: 9, id_client: 109, id_employee: 209, dateCreated: '2024-01-09', comentary: 'El servicio técnico no resolvió mi problema.' },
  { id: 10, id_client: 110, id_employee: 210, dateCreated: '2024-01-10', comentary: 'El producto llegó incompleto, faltaban piezas.' }
  
  ];

  metaDataColumns: MetaDataColumn[] = [
    { field: "id", title: "ID" },
    { field: "id_client", title: "ID CLIENTE" },
    { field: "id_employee", title: "ID EMPLEADO" },
    { field: "dateCreated", title: "FECHA DE CREACIÓN" },
    { field: "comentary", title: "COMENTARIO" }
  ];

  keypadButtons: KeypadButton[] = [
    { icon: "cloud_download", tooltip: "EXPORTAR", color: "accent", action: "DOWNLOAD" },
    { icon: "add", tooltip: "AGREGAR", color: "primary", action: "NEW" }
  ];

  records: IComplaint[] = [];
  totalRecords = this.data.length;
  currentPage = 0;

  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loadComplaints();
  }

  loadComplaints() {
    this.records = [...this.data];
    this.changePage(this.currentPage);
  }

  editRecord(row: IComplaint) {
    this.openForm(row);
  }

  delete(id: number) {
    const position = this.data.findIndex(ind => ind.id === id);
    if (position !== -1) {
      this.data.splice(position, 1);
      this.totalRecords = this.data.length;
      this.loadComplaints();
    }
  }

  openForm(row: IComplaint | null = null) {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row
    };
    const reference: MatDialogRef<FormComponent> = this.dialog.open(FormComponent, options);

    reference.afterClosed().subscribe((response) => {
      if (!response) { return; }
      if (response.id) {
        const index = this.data.findIndex(complaint => complaint.id === response.id);
        if (index !== -1) {
          this.data[index] = response;
        }
        this.totalRecords = this.data.length;
        this.loadComplaints();
        this.showMessage('Registro actualizado');
      } else {
        const newComplaint = { ...response, id: this.data.length + 1 };
        this.data.push(newComplaint);
        this.totalRecords = this.data.length;
        this.loadComplaints();
        this.showMessage('Registro exitoso');
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet("Lista de Quejas", "quejas", this.data);
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
    this.records = this.data.slice(skip, skip + pageSize);
    this.currentPage = page;
  }
}
