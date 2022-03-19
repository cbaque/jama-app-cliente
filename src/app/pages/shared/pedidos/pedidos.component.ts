import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MessageService } from 'src/app/core/services/message.service';
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
  
  constructor(
    public viewCtrl: ModalController,
    private pedidoOff: PedidosOfflineService,
    private smsSrv: MessageService,
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
      cantidad : this.cantidad,
      costo : this.PRODUCTOS.costo,
      iva : this.PRODUCTOS.iva,
      subtotal : ( this.PRODUCTOS.costo * this.cantidad ),
      iva_valor : ( this.PRODUCTOS.iva === 's') ? ( ( this.PRODUCTOS.costo * this.cantidad ) * 12 ) / 100 : 0,
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

}
