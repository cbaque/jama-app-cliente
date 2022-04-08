import { Injectable } from '@angular/core';
import { ConectionService } from '../conection/conection.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosOfflineService {

  readonly dbTableOrders: string = "orders";

  constructor(
    private conOffline: ConectionService,
  ) { }

  public store( data: any ) {

    return new Promise( ( resolve, reject ) => {

      this.conOffline.open()
      .then( ( db ) => {
        db.executeSql(
          `INSERT INTO ${ this.dbTableOrders } ( 
            id_producto, 
            producto, 
            ruc_empresa,
            cantidad,
            costo,
            iva,
            subtotal,
            iva_valor,
            iva_costo,
            total
            ) 
            VALUES 
            ( 
              '${ data.id_producto }', 
              '${ data.producto }', 
              '${ data.ruc_empresa }', 
              '${ data.cantidad }',
              '${ data.costo }',
              '${ data.iva }',
              '${ data.subtotal }',
              '${ data.iva_valor }',
              '${ data.iva_costo }',
              '${ data.total }'
            )`
          ,[]
        ).then( ( row: any ) => {
          resolve( { code: row.insertId, message: `Producto ${ data.producto } agregado correctamente` } )
        },( e ) => {
          resolve( { code: -1, message: e.message } );
        });
      })
      .catch( e => resolve(  { code: -1, message: e.message }  ) )     
    });

  }
}
