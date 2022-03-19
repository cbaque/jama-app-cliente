import { Injectable } from '@angular/core';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(
    private DataServ: EnvService,
  ) { }

  public post( data: any ) {
    return this.DataServ.postQuery<any>(`pedido`, data);
  }

  public postCliente( data: any ) {
    return this.DataServ.postQuery<any>(`cliente/pedido`, data);
  }
}
