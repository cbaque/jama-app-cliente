import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { ModalController } from '@ionic/angular';
import { MessageService } from 'src/app/core/services/message.service';
import { ConectionService } from 'src/app/core/services/offline/conection/conection.service';
import { PedidosService } from 'src/app/core/services/pedidos/pedidos.service';
import { ValidacionRegistrosService } from 'src/app/helpers/validacion-registros.service';

@Component({
  selector: 'app-checkout-login',
  templateUrl: './checkout-login.component.html',
  styleUrls: ['./checkout-login.component.scss'],
})
export class CheckoutLoginComponent implements OnInit {

  readonly dbTableOrdes: string = "orders";
  ORDERS: Array <any> = [];
  public totales = { subtotal: 0, iva: 0, total: 0 };
  form: FormGroup;
  
  constructor(
    public viewCtrl: ModalController,
    private conOffline: ConectionService,  
    private fb: FormBuilder,
    public validator: ValidacionRegistrosService,
    private pedidoSrv: PedidosService,
    private smsSrv: MessageService,
  ) { }

  ngOnInit() {
    this.getOrders();
    this.form = this.createForm();
  }


  closeModal() {
    this.viewCtrl.dismiss({
      'dismiss' : false
    });

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

  private createForm(){
    return this.fb.group({
      email        : [ '', [ Validators.required, Validators.pattern('^[0-9,$]*$'), Validators.minLength(10), Validators.maxLength(13) ] ],
      password     : [ '', [ Validators.required, Validators.minLength(5) ] ],
      detalle      : []
    });
  }


  pedirConLogin(){
    this.smsSrv.openLoading();
    
    this.form.get('detalle').setValue( this.ORDERS );
    let data = this.form.value

    this.pedidoSrv.postLogin( data )
    .subscribe( 
      ( resp) => {
        this.conOffline.open()
        .then((db: SQLiteObject) => {
          db.executeSql(` DELETE FROM ${ this.dbTableOrdes }`, [])
          .then( res => {
          
            setTimeout(() => {
              this.smsSrv.closeLoading();
              this.smsSrv.isNewOrder.next(true);
              this.viewCtrl.dismiss({
                'dismiss' : true
              })
            }, 2000);        
          });
        })
      },
      error => {
        this.smsSrv.openError( error );
        this.smsSrv.closeLoading();
      } 
    )
  }

}
