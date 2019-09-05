import { Injectable } from '@angular/core';
import { Product } from './product.interface';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, shareReplay } from "rxjs/operators";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string = environment.baseUrl;
  products$: Observable<Product[]>

  constructor(private http: HttpClient) { 
    this.loadProducts();
  }

  loadProducts() {
    let url:string = this.baseUrl + `?$orderby=ModifiedDate%20desc`;
    this.products$ = this
    .http
    .get<Product[]>(url)
    .pipe(
      tap(console.table),
      shareReplay(),
      catchError(this.handleError)
    );
  }

  insertProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, newProduct);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + id);           
  }

  private handleError(error: HttpErrorResponse) {
    // in a real world app, you may send the error to the server using some remote logging infrastructure
    // instead of just logging it to the console
    let errorMsg: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMsg = 'An error occurred:' + error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMsg = `Backend returned code ${error.status}, body was: ${error.error}`;
    }
    console.error(errorMsg);
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }


}
