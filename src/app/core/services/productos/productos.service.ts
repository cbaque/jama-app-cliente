import { Injectable } from '@angular/core';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private DataServ: EnvService
  ) { }

  public get() {
    return this.DataServ.getQuery<any>(`productos`);
  }   
}
