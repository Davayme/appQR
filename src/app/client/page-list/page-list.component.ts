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
    { _id: 1, name: 'Juan', lastname: 'Perez', email: 'juan@gmail.com', phone: '0999999999', address: 'Calle A' },
    { _id: 2, name: 'Maria', lastname: 'Gomez', email: 'juana@gmai.com', phone: '0999999999', address: 'Calle B' },
    { _id: 3, name: 'Alex', lastname: 'Cortez', email: 'alex@gmai.com', phone: '0999999999', address: 'Calle C' },
    { _id: 4, name: 'Pedro', lastname: 'Perez', email: '', phone: '0999999999', address: 'Calle D' },
    { _id: 5, name: 'Jose', lastname: 'Gomez', email: '', phone: '0999999999', address: 'Calle E' },
    { _id: 6, name: 'Juan', lastname: 'Perez', email: '', phone: '0999999999', address: 'Calle A' },
    { _id: 7, name: 'Maria', lastname: 'Gomez', email: '', phone: '0999999999', address: 'Calle B' },
    { _id: 8, name: 'Alex', lastname: 'Cortez', email: '', phone: '0999999999', address: 'Calle C' },
  ]

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

  records: IClient[] = []
  totalRecords = this.data.length

  bottomSheet = inject(MatBottomSheet)
  dialog = inject(MatDialog)
  snackBar = inject(MatSnackBar)

  constructor() {
    this.loadClients()
  }

  loadClients() {
    this.records = this.data
  }

  delete(id: number) {
    const position = this.data.findIndex(ind => ind._id === id)
    this.records = this.data.splice(position, 1)
    this.loadClients()
  }

  openForm(row: any | null = null) {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row
    }
    const reference: MatDialogRef<FormComponent> = this.dialog.open(FormComponent, options)

    reference.afterClosed().subscribe((response) => {
      if (!response) { return }
      if (response.id) {
        const agencia = { ...response }
        this.loadClients()
        this.showMessage('Registro actualizado')

      } else {
        const agencia = { ...response }
        this.data.push(agencia)
        this.loadClients()
        this.showMessage('Registro exitoso')
      }
    })
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet("Lista de Clientes", "clientes", this.data)
        break
      case 'NEW':
        this.openForm()
        break
    }
  }

  showBottomSheet(title: string, fileName: string, data: any) {
    this.bottomSheet.open(DownloadComponent)
  }

  showMessage(message: string, duration: number = 5000) {
    this.snackBar.open(message, '', { duration })
  }

  changePage(page: number) {
    const pageSize = environment.PAGE_SIZE
    const skip = pageSize * page
    this.data = this.records.slice(skip, skip + pageSize)
  }
}
