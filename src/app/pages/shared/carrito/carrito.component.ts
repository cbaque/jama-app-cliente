import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { ModalController } from '@ionic/angular';
import { MessageService } from 'src/app/core/services/message.service';
import { ConectionService } from 'src/app/core/services/offline/conection/conection.service';
import { CheckoutComponent } from '../checkout/checkout.component';
import { MensajeConfirmacionComponent } from '../mensaje-confirmacion/mensaje-confirmacion.component';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit {

  readonly dbTableOrdes: string = "orders";
  ORDERS: Array <any> = [];
  public totales = { subtotal: 0, iva: 0, total: 0 }
  modalCheckout: HTMLIonModalElement;
  modalConfirm: HTMLIonModalElement;

  constructor(
    public viewCtrl: ModalController,
    private conOffline: ConectionService,
    private smsSrv: MessageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getOrders();
    
  }

  closeModal() {
    this.viewCtrl.dismiss();
  } 
  
  async getOrders() {

    this.conOffline.open()
    .then((db: SQLiteObject) => {
      db.executeSql(` SELECT * FROM ${ this.dbTableOrdes }`, [])
      .then( res => {
        this.ORDERS = [];
        if ( res.rows.length > 0 ) {
          for (let index = 0; index < res.rows.length; index++) {
            this.ORDERS.push(res.rows.item(index));
          }
        }
        this.getTotales();
      });
    })    

  }

  async getTotales() {
    this.totales.subtotal = 0;
    this.totales.iva = 0;
    this.totales.total = 0;
    
    this.ORDERS.forEach( e => {
      this.totales.subtotal = this.totales.subtotal + e.subtotal;
      this.totales.iva = this.totales.iva + e.iva_valor;
      this.totales.total = this.totales.total + e.total;
    });
  }

  deleteOrder( id: number ) {

    this.smsSrv.openLoading();

    this.conOffline.open()
    .then((db: SQLiteObject) => {
      db.executeSql(` DELETE FROM ${ this.dbTableOrdes } WHERE id = ${ id } `, [])
      .then( res => {

        this.getOrders();

        setTimeout(() => {
          this.smsSrv.closeLoading();
          this.smsSrv.isNewOrder.next(true);
        }, 2000);        
        
      });
    }) 

  }

  deleteAllOrders() {

    this.smsSrv.openLoading();

    this.conOffline.open()
    .then((db: SQLiteObject) => {
      db.executeSql(` DELETE FROM ${ this.dbTableOrdes }`, [])
      .then( res => {

        this.getOrders();

        setTimeout(() => {
          this.smsSrv.closeLoading();
          this.smsSrv.isNewOrder.next(true);
        }, 2000);        
        
      });
    }) 

  }

  async checkout() {
    this.modalCheckout = await this.viewCtrl.create({
      component: CheckoutComponent     
    });

    this.modalCheckout.onWillDismiss().then(
      ( res: any ) => { 
        if ( res.data.dismiss ){
          this.modalConfirmacion();
          this.getOrders();
        }
      }
    );

    return await this.modalCheckout.present();
  }

  async modalConfirmacion() {
    this.modalConfirm = await this.viewCtrl.create({
      component: MensajeConfirmacionComponent     
    });

    this.modalConfirm.onWillDismiss().then(
      () => { 
        this.closeModal();
      }
    );

    return await this.modalConfirm.present();
  }

  roundDecimal( valor: any ) {
    return parseFloat( valor ).toFixed(2);
  }

}
