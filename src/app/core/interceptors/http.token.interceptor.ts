import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {};
    const token = this.jwtService.getToken();

     if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    const request = req.clone({ setHeaders: headersConfig });

    return next.handle(request)
  /*   .pipe(map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const newToken = event.headers.get('newToken');
        if (newToken) {
          localStorage.setItem('authorizationData', newToken);
          this.jwtService.saveToken(newToken);
        }
      }
      return event;
    })); */
    .do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // process successful responses here
        const newToken = event.headers.get('newToken');
        if (newToken) {
          localStorage.setItem('authorizationData', newToken);
          this.jwtService.saveToken(newToken);
        }
      }
    }, (error: any) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400 || error.status === 401) {
          if (error.error.message == 'The Token has expired') {
            this.router.navigate(['/login']);
          } else {
            this.router.navigate(['/access-denied']);
          }
        }
      }
    });
  }

}

