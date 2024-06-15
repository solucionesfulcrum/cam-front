import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app/app.routing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { TokenInterceptor } from '@interceptors/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {NgStepperModule} from 'angular-ng-stepper';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from '@environments/environment';
import { NotifierInterceptor } from '@interceptors/notifier.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { AppConfig } from './app/core/app.config';
import { NoInternetInterceptor } from '@interceptors/internet';
import { CacheImageService } from '@shared/utils/no-internet-cache-img';

// if (environment.production) {
//   enableProdMode();
// }

// platformBrowserDynamic().bootstrapModule(AppModule)
// .catch(err => console.error(err));

bootstrapApplication(AppComponent, {
  
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotifierInterceptor,
      multi: true,
    },
    importProvidersFrom([HttpClientModule, BrowserAnimationsModule], BrowserAnimationsModule, ToastrModule.forRoot(AppConfig.TOAST_CONFIG)),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    provideRouter(routes),
     { provide: HTTP_INTERCEPTORS, useClass: NoInternetInterceptor, multi: true },
     CacheImageService,
  ],
}).catch((error) => {
  console.error(error);
});
