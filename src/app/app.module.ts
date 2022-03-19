import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SQLite } from '@ionic-native/sqlite/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { NgFallimgModule } from 'ng-fallimg';
// import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
// import { Network } from '@awesome-cordova-plugins/network/ngx';
// import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';


@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    NgFallimgModule.forRoot({
      default: 'assets/images/img-no-found.png'
    })
  ],
  providers: [
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: JwtInterceptor, multi: true 
    },
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: ErrorInterceptor, multi: true 
    }, 
    SQLite,
    NativeStorage,
    // Geolocation,
    // Network,
    // FileTransfer,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
