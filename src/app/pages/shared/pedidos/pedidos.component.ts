import { Component, Input, OnInit } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { ModalController } from '@ionic/angular';
import { MessageService } from 'src/app/core/services/message.service';
import { ConectionService } from 'src/app/core/services/offline/conection/conection.service';
import { PedidosOfflineService } from 'src/app/core/services/offline/pedidos-offline/pedidos-offline.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {

  @Input() item: any;
  PRODUCTOS: any;
  cantidad: number = 1;
  precio: any;
  TOTAL_ORDERS : number = 0;
  TOTAL_ORDERS_RUC : number = 0;
  readonly dbTableOrdes: string = "orders";
  
  constructor(
    public viewCtrl: ModalController,
    private pedidoOff: PedidosOfflineService,
    private smsSrv: MessageService,
    private conOffline: ConectionService,
  ) { 
  }

  ngOnInit() {
    this.PRODUCTOS = this.item;
    this.precio = this.PRODUCTOS.costo;
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  sumaCantidad() {
    this.cantidad = this.cantidad + 1;
    this.calculaPrecio()
  }

  restaCantidad() {
    this.cantidad = this.cantidad - 1;
    if ( this.cantidad <= 0 )
      this.cantidad = 1

    this.calculaPrecio()
  }
  
  calculaPrecio() {
    this.precio = this.PRODUCTOS.costo * this.cantidad
  }

  async store() {

    let form = {  
      id_producto : this.PRODUCTOS.id_prod,
      producto : this.PRODUCTOS.titulo_prod,
      ruc_empresa : this.PRODUCTOS.ruc_empresa,
      cantidad : this.cantidad,
      costo : this.PRODUCTOS.costo,
      iva : this.PRODUCTOS.iva,
      subtotal : ( this.PRODUCTOS.costo * this.cantidad ),
      iva_valor : ( this.PRODUCTOS.iva === 's') ? ( ( this.PRODUCTOS.costo * this.cantidad ) * this.PRODUCTOS.detalle_iva.valor ) / 100 : 0,
      iva_costo:  ( this.PRODUCTOS.iva === 's') ? this.PRODUCTOS.detalle_iva.valor : 0,
      total: 0
    };

    form.total = form.subtotal + form.iva_valor;
    this.smsSrv.openLoading();

    this.pedidoOff.store( form )
    .then( (res: any) => {
      if ( res !== -1 ){

        setTimeout(() => {
          this.closeModal();
          this.smsSrv.closeLoading();
          this.smsSrv.openSuccess( res.message );
          this.smsSrv.isNewOrder.next(true);
        }, 2000);

      }
    })
  }


  getOrdersTotal() {

    return new Promise( ( resolve, reject ) => {
      
      this.conOffline.open()
      .then((db: SQLiteObject) => {
        db.executeSql(` SELECT COUNT(1) AS total FROM ${ this.dbTableOrdes }`, [])
        .then( res => {
          let conteo = res.rows.item(0);
          resolve ( Number( conteo.total ) );
        },
        ( error ) => {
          resolve( null )
        }
        );
      });

    })
  }

  getOrdersRUC( ruc_empresa: string ) {

    return new Promise( ( resolve, reject ) => {
      
      this.conOffline.open()
      .then((db: SQLiteObject) => {
        db.executeSql(` SELECT COUNT(1) AS total FROM ${ this.dbTableOrdes } WHERE ruc_empresa = ?`, [ ruc_empresa ])
        .then( res => {
          let conteo = res.rows.item(0);
          resolve ( Number( conteo.total ) );
        },
        ( error ) => {
          resolve( null )
        }
        );
      });

    })   
  }  

}
