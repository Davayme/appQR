import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { environment } from 'src/environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface IEmployee {
  id: number;
  name: string;
  position: string;
  address: string;
  phone: string;
}


@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})
export class PageListComponent {
  data: IEmployee[] = [
    { id: 1, name: 'Alejandro Fernández', position: 'Gerente', address: 'Calle A', phone: '123456789' },
    { id: 2, name: 'Beatriz González', position: 'Asistente', address: 'Calle B', phone: '987654321' },
    { id: 3, name: 'Carlos Martínez', position: 'Desarrollador', address: 'Calle C', phone: '456789123' },
    { id: 4, name: 'Diana Torres', position: 'Diseñadora', address: 'Calle D', phone: '321654987' },
    { id: 5, name: 'Eduardo López', position: 'Analista', address: 'Calle E', phone: '654321789' },
    { id: 6, name: 'Fernanda Morales', position: 'Tester', address: 'Calle F', phone: '789123456' },
    { id: 7, name: 'Gabriel Pérez', position: 'Director', address: 'Calle G', phone: '147258369' },
    { id: 8, name: 'Hilda Romero', position: 'Recursos Humanos', address: 'Calle H', phone: '258369147' },
    { id: 9, name: 'Ignacio Castro', position: 'Marketing', address: 'Calle I', phone: '369147258' },
    { id: 10, name: 'Julia Rivas', position: 'Finanzas', address: 'Calle J', phone: '963852741' },
    { id: 11, name: 'Kevin Martínez', position: 'Ventas', address: 'Calle K', phone: '852963741' },
    { id: 12, name: 'Laura Vargas', position: 'Contabilidad', address: 'Calle L', phone: '741258963' },
    { id: 13, name: 'Manuel Díaz', position: 'Soporte', address: 'Calle M', phone: '159753486' },
    { id: 14, name: 'Natalia Salazar', position: 'Investigadora', address: 'Calle N', phone: '753159864' },
    { id: 15, name: 'Oscar Salgado', position: 'Secretario', address: 'Calle O', phone: '258147963' },
  ];

  metaDataColumns: MetaDataColumn[] = [
    { field: "id", title: "ID" },
    { field: "name", title: "NOMBRE" },
    { field: "position", title: "CARGO" },
    { field: "address", title: "DIRECCIÓN" },
    { field: "phone", title: "TELÉFONO" }
  ];

  keypadButtons: KeypadButton[] = [
    { icon: "cloud_download", tooltip: "EXPORTAR", color: "accent", action: "DOWNLOAD" },
    { icon: "add", tooltip: "AGREGAR", color: "primary", action: "NEW" }
  ];

  records: IEmployee[] = [];
  totalRecords = this.data.length;
  currentPage = 0;

  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.records = [...this.data];
    this.changePage(this.currentPage);
  }

  editRecord(row: IEmployee) {
    this.openForm(row);
  }

  delete(id: number) {
    const position = this.data.findIndex(ind => ind.id === id);
    if (position !== -1) {
      this.data.splice(position, 1);
      this.totalRecords = this.data.length;
      this.loadEmployees();
    }
  }

  openForm(row: IEmployee | null = null) {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row
    };
    const reference: MatDialogRef<FormComponent> = this.dialog.open(FormComponent, options);

    reference.afterClosed().subscribe((response) => {
      if (!response) { return; }
      if (response.id) {
        const index = this.data.findIndex(employee => employee.id === response.id);
        if (index !== -1) {
          this.data[index] = response;
        }
        this.totalRecords = this.data.length;
        this.loadEmployees();
        this.showMessage('Registro actualizado');
      } else {
        const newEmployee = { ...response, id: this.data.length + 1 };
        this.data.push(newEmployee);
        this.totalRecords = this.data.length;
        this.loadEmployees();
        this.showMessage('Registro exitoso');
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet("Lista de Empleados", "empleados", this.data);
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
