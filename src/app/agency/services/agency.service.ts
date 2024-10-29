import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IAgency } from '../interfaces/agency-interface';
@Injectable({
  providedIn: 'root'
})
export class AgencyService {

  apiURL = `${environment.API_URL}/agencies`
  http = inject(HttpClient);

  constructor() { }

  getAgencies(): Observable<IAgency[]> {
    return this.http.get<IAgency[]>(this.apiURL)
  }
  /* `` */
  getAgencyByID(id: number): Observable<IAgency[]> {
    return this.http.get<IAgency[]>(`${this.apiURL}/${id}`)
  }

  createAgency(agency: IAgency): Observable<IAgency[]> {
    return this.http.post<IAgency[]>(`${this.apiURL}`, agency)
  }

  updateAgency(id: number, agency: IAgency): Observable<void> {
    return this.http.put<void>(`${this.apiURL}/${id}`, agency)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`)
  }

}
