import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { ModalController, Platform } from '@ionic/angular';
import { MessageService } from 'src/app/core/services/message.service';
import { ConectionService } from 'src/app/core/services/offline/conection/conection.service';
// import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { CarritoComponent } from '../carrito/carrito.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public C_NEW_ORDER : number = 0;
  readonly dbTableOrdes: string = "orders";
  public USER: any;

  constructor(
    private messageSrv: MessageService,
    public modal: ModalController,
    private conOffline: ConectionService,
    private nativeStorage: NativeStorage,
    private router: Router,
    private platform: Platform,
  ) { 
    this.platform.ready().then(() => {
      this.getNumOrders();
    })
  }
  
  ngOnInit() {
    this.checkUserLogin();
    this.messageSrv.isNewOrder.subscribe( res =>  {
      if ( res ) {
        this.getNumOrders();
      }
    })

    this.messageSrv.isLogout.subscribe( res =>  {
      if ( res ) {
        this.USER = null;
      }else {
        this.checkUserLogin()
      }
    })


  }


  async carrito() {
    const modal = await this.modal.create({
      component: CarritoComponent,    
    });
    return await modal.present();    
  }

  getNumOrders() {

    this.C_NEW_ORDER = 0

    this.conOffline.open()
    .then((db: SQLiteObject) => {
      db.executeSql(` SELECT COUNT(1) AS conteo FROM ${ this.dbTableOrdes }`, [])
      .then( 
        ( res ) => {
        if ( res.rows.length > 0 ) {
          for (let index = 0; index < res.rows.length; index++) {
            let conteo = res.rows.item(index);
            this.C_NEW_ORDER = conteo.conteo;
          }
        }
      },
      ( error ) => {
        console.log( 'error al conteo ', error)
      }
      );
    })    

  }

  checkUserLogin() {
    this.nativeStorage.getItem('user')
    .then( 
      res => {
        this.USER = res;
      },
      error => {
        console.log(error)
      }
    )
  }

}
