import { Injectable } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  
  constructor(
    private DataServ: EnvService,
    private nativeStorage: NativeStorage,
  ) { 
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('token'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  logout() {
    this.nativeStorage.remove('user');
    this.nativeStorage.clear();
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    // return of({ success: false });
  }  


  public post( data: any ) {
    return this.DataServ.postQuery<any>(`auth/login`, data);
  }
  
  public update( data: any ) {
    return this.DataServ.postQuery<any>(`edit`, data);
  }

}
