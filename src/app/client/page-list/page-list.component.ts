import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { environment } from 'src/environments/environment.development';

export interface IClient {
  _id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})


export class PageListComponent {
  data: IClient[] = [
    { _id: 1, name: 'Juan', lastname: 'Perez', email: 'juan.perez@example.com', phone: '0998765432', address: 'Av. Siempre Viva 123' },
    { _id: 2, name: 'Maria', lastname: 'Gomez', email: 'maria.gomez@example.com', phone: '0987654321', address: 'Calle Falsa 456' },
    { _id: 3, name: 'Alex', lastname: 'Cortez', email: 'alex.cortez@example.com', phone: '0976543210', address: 'Boulevard de los Sueños 789' },
    { _id: 4, name: 'Pedro', lastname: 'Lopez', email: 'pedro.lopez@example.com', phone: '0965432109', address: 'Calle de la Amargura 101' },
    { _id: 5, name: 'Jose', lastname: 'Martinez', email: 'jose.martinez@example.com', phone: '0954321098', address: 'Avenida de la Paz 202' },
    { _id: 6, name: 'Ana', lastname: 'Fernandez', email: 'ana.fernandez@example.com', phone: '0943210987', address: 'Calle del Sol 303' },
    { _id: 7, name: 'Luis', lastname: 'Garcia', email: 'luis.garcia@example.com', phone: '0932109876', address: 'Plaza de la Luna 404' },
    { _id: 8, name: 'Laura', lastname: 'Rodriguez', email: 'laura.rodriguez@example.com', phone: '0921098765', address: 'Camino de las Estrellas 505' },
    { _id: 9, name: 'Carlos', lastname: 'Sanchez', email: 'carlos.sanchez@example.com', phone: '0910987654', address: 'Calle de los Sueños 606' },
    { _id: 10, name: 'Elena', lastname: 'Ramirez', email: 'elena.ramirez@example.com', phone: '0909876543', address: 'Avenida de los Poetas 707' },
    { _id: 11, name: 'Miguel', lastname: 'Torres', email: 'miguel.torres@example.com', phone: '0898765432', address: 'Calle de la Esperanza 808' },
    { _id: 12, name: 'Sofia', lastname: 'Diaz', email: 'sofia.diaz@example.com', phone: '0887654321', address: 'Boulevard de la Alegría 909' },
    { _id: 13, name: 'Fernando', lastname: 'Ruiz', email: 'fernando.ruiz@example.com', phone: '0876543210', address: 'Calle de la Fortuna 1010' },
    { _id: 14, name: 'Isabel', lastname: 'Hernandez', email: 'isabel.hernandez@example.com', phone: '0865432109', address: 'Avenida de la Libertad 1111' },
    { _id: 15, name: 'Ricardo', lastname: 'Morales', email: 'ricardo.morales@example.com', phone: '0854321098', address: 'Calle de la Amistad 1212' },
  ];

  metaDataColumns: MetaDataColumn[] = [
    { field: "_id", title: "ID" },
    { field: "name", title: "NOMBRE" },
    { field: "lastname", title: "APELLIDO" },
    { field: "email", title: "EMAIL" },
    { field: "phone", title: "TELÉFONO" },
    { field: "address", title: "DIRECCIÓN" }
  ]

  keypadButtons: KeypadButton[] = [
    { icon: "cloud_download", tooltip: "EXPORTAR", color: "accent", action: "DOWNLOAD" },
    { icon: "add", tooltip: "AGREGAR", color: "primary", action: "NEW" }
  ]

  records: IClient[] = [];
  totalRecords = this.data.length

  currentPage = 0;

  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loadClients();
  }

  loadClients() {
    this.records = [...this.data];
    this.changePage(this.currentPage);
  }

  delete(id: number) {
    const position = this.data.findIndex(ind => ind._id === id);
    if (position !== -1) {
      this.data.splice(position, 1);
      this.totalRecords = this.data.length;
      console.log(this.data);
      this.loadClients();
    }
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
      if (response._id) {
        const index = this.data.findIndex(client => client._id === response._id);
        if (index !== -1) {
          this.data[index] = response;
        }
        this.totalRecords = this.data.length;
        this.loadClients();
        this.showMessage('Registro actualizado');
      } else {
        const newclient = { ...response, _id: this.data.length + 1 };
        this.data.push(newclient);
        this.totalRecords = this.data.length;
        this.loadClients();
        this.showMessage('Registro exitoso');
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet("Lista de Clientes", "clientes", this.data);
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

  editRecord(record: any) {
    const dialogRef = this.dialog.open(FormComponent, {
      data: record
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.data.findIndex(r => r._id === result._id);

        if (index !== -1) {
          this.data[index] = result;
          console.log(this.data);
          this.loadClients();
        }

      }
    });
  }
}