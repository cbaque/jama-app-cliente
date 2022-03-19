import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const apiUlr = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  constructor(
    private http: HttpClient
  ) { }

  // public getQuery<T>(query: string) {
  //   const HttpUploadOptions = {
  //     headers: new HttpHeaders({ 'Content-type': 'application/json' })
  //   };
  //   query = apiUlr + query;
  //   return this.http.get<T>(query, HttpUploadOptions).pipe(map((data: any) => data.data));
  // }

  // public postQuery<T>(query: string, form: any) {
  //   const HttpUploadOptions = {
  //     headers: new HttpHeaders({ 'Content-type': 'application/json' })
  //   };
  //   query = apiUlr + query;
  //   return this.http.post<T>(query, form, HttpUploadOptions).pipe(map((data: any) => data.data));
  // }

  public getQuery<T>(query: string) {
    query = apiUlr + query;
    return this.http.get<T>(query).pipe(map((data: any) => data.data));
  }

  public postQuery<T>(query: string, form: any) {
    query = apiUlr + query;
    return this.http.post<T>(query, form).pipe(map((data: any) => data.data));
  }  

  public putQuery<T>(query: string, form: any) {

    query = apiUlr + query;
    return this.http.put<T>(query, form).pipe(map((data: any) => data.data));
  }

  public deleteQuery<T>(query: string) {

    query = apiUlr + query;
    return this.http.delete<T>(query).pipe(map((data: any) => data.data));
  }   
}
