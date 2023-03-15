import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(public loaderService: LoaderService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loaderService.isLoading.next(true)
    return next.handle(request)
    .pipe(
      tap((event:  HttpEvent<any>) =>{
        // update the progress bar
         if (event.type == HttpEventType.UploadProgress) {
          console.log("http uploading...")
          const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          this.loaderService.percent.next(percentDone)
        }
        if (event.type == HttpEventType.DownloadProgress) {
          console.log("http downloading...")
          const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          this.loaderService.percent.next(percentDone)
          console.log("http downloading...", percentDone, " event.total: ", event.total, "event.loaded: ", event.loaded)
        }
        console.log("http intercept...")
      }),
      finalize(()=>{
        this.loaderService.isLoading.next(false)
      })
    )
  }
}
