import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule, Route, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicStorageModule } from '@ionic/storage';
import { environment } from '@biosimulations/shared/environments';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/services';
import { MarkedPreloadingStrategy } from './MarkedPreloadingStrategy'
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ErrorHandler as BiosimulationsErrorHandler, errorRoutes, Error404Component } from '@biosimulations/shared/ui';

import config from '../assets/config.json';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'simulators',
    loadChildren: () =>
      import('./simulators/simulators.module').then((m) => m.SimulatorsModule),
    data: {
      breadcrumb: 'Simulators',
      preload: {
        preload: true,
        delay: 500
      },
    }
  },
  {
    path: 'help',
    loadChildren: () =>
      import('./help/help.module').then((m) => m.HelpModule),
    data: {
      breadcrumb: 'Help',
      preload: {
        preload: true,
        delay: 1000
      }
    }
  },
  {
    path: 'error',
    children: errorRoutes,
  },
  {
    path: '**',
    component: Error404Component,
  },
];
routes.forEach((route: Route): void => {
  if (route.data) {
    route.data.config = config;
  } else {
    route.data = {config};
  }
});

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedUiModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled', scrollPositionRestoration: 'enabled', preloadingStrategy: MarkedPreloadingStrategy }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    IonicStorageModule.forRoot({
      driverOrder: ['indexeddb', 'websql', 'localstorage']
    }),
  ],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
    { provide: ConfigService, useValue: config },
    { provide: ErrorHandler, useClass: BiosimulationsErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
