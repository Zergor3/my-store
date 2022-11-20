import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, retry, throwError, zip } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { checkTime } from '../interceptors/time.interceptor';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.API_URL}/api`;
  constructor(private http: HttpClient) {}

  getByCategory(categoryId: number, limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(
      `${this.apiUrl}/categories/${categoryId}/products`,
      {
        params,
      }
    );
  }

  getAll(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http
      .get<Product[]>(`${this.apiUrl}/products`, {
        params,
        context: checkTime(),
      })
      .pipe(
        retry(3),
        map((products) =>
          products.map((item) => {
            return {
              ...item,
              taxes: 0.19 * item.price,
            };
          })
        )
      );
  }

  fetchReadAndUpdate(id: number, dto: UpdateProductDTO) {
    return zip(this.getOne(id), this.update(id, dto));
  }

  getOne(id: number) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError('Algo esta fallando en el server');
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError('El producto no existe');
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError('No estas permitido');
        }
        return throwError('Ups algo salio mal');
      })
    );
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(`${this.apiUrl}/products`, dto);
  }

  update(id: number, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }
}
