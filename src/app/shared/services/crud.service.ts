import { HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CrudService<T, ID> {
  private baseURL = environment.API_URL;

  constructor(private http: HttpClient) {}


  getAll(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseURL}/${endpoint}`);
  }


  getById(endpoint: string, id: ID): Observable<T> {
    return this.http.get<T>(`${this.baseURL}/${endpoint}/${id}`);
  }

  create(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(`${this.baseURL}/${endpoint}`, data);
  }

  update(endpoint: string, id: ID, data: T): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/${endpoint}/${id}`, data);
  }

  delete(endpoint: string, id: ID): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${endpoint}/${id}`);
  }
}
