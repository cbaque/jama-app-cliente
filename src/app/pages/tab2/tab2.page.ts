import { ChangeDetectorRef, Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PromocionesService } from '../../core/services/productos/promociones.service';
import { PedidosComponent } from '../shared/pedidos/pedidos.component';

declare var window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page { 

  LOADING_PRODUCTOS: boolean;
  PRODUCTOS: any = [];
  PRODUCTOS_BACKUP: any = []

  constructor(
    private prdSrv: PromocionesService,
    public modal: ModalController
  ) {
  }

  index() {
    this.LOADING_PRODUCTOS = true;
    this.prdSrv.get().subscribe( res => {
      this.PRODUCTOS = res;
      this.PRODUCTOS_BACKUP = this.PRODUCTOS.slice();
      this.LOADING_PRODUCTOS = false;
    });
  }

  async pedido( item: any) {
    const modal = await this.modal.create({
      component: PedidosComponent,
      componentProps: {
        item
      }      
    });
    return await modal.present();
  }


  ionViewDidEnter() {
    this.index();
  }

  doRefresh(event) {
    this.index();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }


  getProductos( ev: any ) {
    this.PRODUCTOS = this.PRODUCTOS_BACKUP;
    const val = ev.target.value;
    this.PRODUCTOS = this.PRODUCTOS.filter((item) => {
      return ( item.titulo_prod.toLowerCase().indexOf(val.toLowerCase() ) > -1 ||  item.aliado.razon_social.toLowerCase().indexOf(val.toLowerCase() ) > -1) ;
    })
  }



}
