import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { ModalController } from '@ionic/angular';
import { MessageService } from 'src/app/core/services/message.service';
import { ConectionService } from 'src/app/core/services/offline/conection/conection.service';
import { PedidosService } from 'src/app/core/services/pedidos/pedidos.service';
import { ValidacionRegistrosService } from 'src/app/helpers/validacion-registros.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  USER: any = null;
  ORDERS: Array <any> = [];
  readonly dbTableOrdes: string = "orders";
  public totales = { subtotal: 0, iva: 0, total: 0 };
  form: FormGroup;

  constructor(
    public viewCtrl: ModalController,
    private smsSrv: MessageService,
    private nativeStorage: NativeStorage,  
    private conOffline: ConectionService,  
    private pedidoSrv: PedidosService,
    private router: Router,
    private fb: FormBuilder,
    public validator: ValidacionRegistrosService,
    
  ) { 
    this.checkUserLogin();
  }

  ngOnInit() {
    this.form = this.createForm();
    this.getOrders();
  }

  closeModal() {
    this.viewCtrl.dismiss({
      'dismiss' : false
    });
  }  

  checkUserLogin() {

    this.nativeStorage.getItem('user')
    .then( 
      res => {
      this.USER = res;
      },
      error => {
        console.log('error', error)
      }
    )
  }
  
  private createForm(){
    return this.fb.group({
      cedula        : [ '', [ Validators.required, Validators.pattern('^[0-9,$]*$'), Validators.minLength(10), Validators.maxLength(13) ] ],
      nombres       : [ '', [ Validators.required ] ],
      apellidos     : [ '', [ Validators.required ] ],
      telefono      : [ '', [ Validators.required, Validators.pattern('^[0-9,$]*$') ] ],
      correo        : [ '', [ Validators.required, Validators.pattern('^[^@]+@[^@]+\.[a-zA-Z]{2,}$') ] ],
      direccion     : [ '', [ Validators.required ] ],
      password      : [ '', [ Validators.required, Validators.minLength(5) ] ],
      detalle       : []
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

  pedir() {
    this.smsSrv.openLoading();

    this.pedidoSrv.post( { detalle: this.ORDERS } )
    .subscribe( 
      ( resP ) => {
        
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
    ( error ) => {
      this.smsSrv.openError( error );
      this.smsSrv.closeLoading();
    })
  }


  pedirConClienteNuevo(){

    this.smsSrv.openLoading();
    
    this.form.get('detalle').setValue( this.ORDERS );
    let data = this.form.value

    this.pedidoSrv.postCliente( data )
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
