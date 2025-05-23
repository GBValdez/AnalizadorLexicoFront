import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { CodeEditorModule, provideCodeEditor } from '@ngstack/code-editor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './utils/interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideCodeEditor({
      baseUrl: 'assets/monaco',
      // use local Typings Worker
      typingsWorkerUrl: 'assets/workers/typings-worker.js',
    }),
    importProvidersFrom(HttpClientModule),
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
};
