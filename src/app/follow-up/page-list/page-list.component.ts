import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { environment } from 'src/environments/environment.development';

export interface IFollowUp {
  id: number; 
  complaintId: number; 
  status: string; 
  assignedTo: string; 
  createdDate: string; 
  comments: string;
}

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})
export class PageListComponent {
  data: IFollowUp[] = [
    { 
      id: 1, 
      complaintId: 101, 
      status: 'Abierto', 
      assignedTo: 'Juan Pérez', 
      createdDate: '2023-01-15', 
      comments: 'Cliente reporta problemas con el producto.' 
    },
    { 
      id: 2, 
      complaintId: 102, 
      status: 'En Proceso', 
      assignedTo: 'María Gómez', 
      createdDate: '2023-02-10', 
      comments: 'Se está investigando el problema reportado.' 
    },
    { 
      id: 3, 
      complaintId: 103, 
      status: 'Cerrado', 
      assignedTo: 'Carlos Martínez', 
      createdDate: '2023-03-05', 
      comments: 'Problema resuelto y cliente notificado.' 
    },
    { 
      id: 4, 
      complaintId: 104, 
      status: 'Abierto', 
      assignedTo: 'Diana Torres', 
      createdDate: '2023-04-01', 
      comments: 'Cliente solicita reembolso.' 
    },
    { 
      id: 5, 
      complaintId: 105, 
      status: 'En Proceso', 
      assignedTo: 'Eduardo López', 
      createdDate: '2023-04-15', 
      comments: 'Revisión de la solicitud de reembolso en curso.' 
    },
    { 
      id: 6, 
      complaintId: 106, 
      status: 'Cerrado', 
      assignedTo: 'Fernanda Morales', 
      createdDate: '2023-05-10', 
      comments: 'Reembolso procesado y cliente notificado.' 
    },
    { 
      id: 7, 
      complaintId: 107, 
      status: 'Abierto', 
      assignedTo: 'Gabriel Pérez', 
      createdDate: '2023-06-01', 
      comments: 'Cliente reporta mal funcionamiento del software.' 
    },
    { 
      id: 8, 
      complaintId: 108, 
      status: 'En Proceso', 
      assignedTo: 'Hilda Romero', 
      createdDate: '2023-06-15', 
      comments: 'Equipo técnico revisando el problema reportado.' 
    },
    { 
      id: 9, 
      complaintId: 109, 
      status: 'Cerrado', 
      assignedTo: 'Ignacio Castro', 
      createdDate: '2023-07-05', 
      comments: 'Problema solucionado con actualización de software.' 
    },
    { 
      id: 10, 
      complaintId: 110, 
      status: 'Abierto', 
      assignedTo: 'Julia Rivas', 
      createdDate: '2023-07-20', 
      comments: 'Cliente insatisfecho con el servicio recibido.' 
    }
  ];

  metaDataColumns: MetaDataColumn[] = [
    { field: "id", title: "ID" },
    { field: "complaintId", title: "QUEJA ID" },
    { field: "assignedTo", title: "ASIGNADO A" },
    { field: "createdDate", title: "FECHA DE CREACIÓN"},
    { field: "status", title: "ESTADO" },
    { field: "comments", title: "COMENTARIOS" }
  ];

  keypadButtons: KeypadButton[] = [
    { icon: "cloud_download", tooltip: "EXPORTAR", color: "accent", action: "DOWNLOAD" },
    { icon: "add", tooltip: "AGREGAR", color: "primary", action: "NEW" }
  ];

  records: IFollowUp[] = [];
  totalRecords = this.data.length;
  currentPage = 0;

  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loadRecords();
  }

  loadRecords() {
    this.records = [...this.data];
    this.changePage(this.currentPage);
  }

  editRecord(row: IFollowUp) {
    this.openForm(row);
  }

  delete(id: number) {
    const position = this.data.findIndex(ind => ind.id === id);
    if (position !== -1) {
      this.data.splice(position, 1);
      this.totalRecords = this.data.length;
      this.loadRecords();
      this.showMessage('Registro eliminado');
    }
  }

  openForm(row: IFollowUp| null = null) {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row
    };
    const reference: MatDialogRef<FormComponent> = this.dialog.open(FormComponent, options);

    reference.afterClosed().subscribe((response) => {
      if (!response) { return; }
      if (response.id) {
        const index = this.data.findIndex(followUp => followUp.id === response.id);
        if (index !== -1) {
          this.data[index] = response;
        }
        this.totalRecords = this.data.length;
        this.loadRecords();
        this.showMessage('Registro actualizado');
      } else {
        const newComplaint = { ...response, id: this.data.length + 1 };
        this.data.push(newComplaint);
        this.totalRecords = this.data.length;
        this.loadRecords();
        this.showMessage('Registro exitoso');
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet("Lista de Seguimientos", "seguimientos", this.data);
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
