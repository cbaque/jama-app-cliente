import { Component } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { MessageService } from '../../core/services/message.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { ProductosService } from 'src/app/core/services/productos/productos.service';
import { ModalController } from '@ionic/angular';
import { PedidosComponent } from '../shared/pedidos/pedidos.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  PRODUCTOS: any = [];
  LOADING_PRODUCTOS: boolean = false;
  PRODUCTOS_BACKUP: any = []

  constructor(
    private prdSrv: ProductosService,
    public modal: ModalController
  ) {
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

  index() {
    this.LOADING_PRODUCTOS = true;
    this.prdSrv.get().subscribe( res => {
      this.PRODUCTOS = res;
      this.PRODUCTOS_BACKUP = this.PRODUCTOS.slice();
      this.LOADING_PRODUCTOS = false;
      
    });
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
