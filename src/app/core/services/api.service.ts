import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GridDataResult } from '@progress/kendo-angular-grid';

const httpOptionsJson = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  loading: boolean;

  constructor(private http: HttpClient) { }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  fetchgrid_postJson(path: string, state: any): Observable<GridDataResult> {
    this.loading = true;
    return this.http.post(`${environment.api_url}${path}`, state)
      .pipe(
        map(response => (<GridDataResult>{
          data: response['data'],
          total: parseInt(response['dataFoundRowsCount'], 10)
        })),
        tap(() => this.loading = false)
      );
  }

  postJson(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body), httpOptionsJson
    ).pipe(
      catchError(this.formatErrors)
    );
  }

  postAuthJson(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.auth_url}${path}`,
      JSON.stringify(body), httpOptionsJson
    ).pipe(
      //map(response => response['data']),
      catchError(this.formatErrors)
    );
  }

  get(path: string): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`)
      .pipe(catchError(this.formatErrors));
  }
}
