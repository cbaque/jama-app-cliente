import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConectionService {

  readonly dbName: string = environment.databaseOffline;
  readonly dbTableOrdes: string = "orders";
  
  constructor(
    private sqlite: SQLite,
    private platform: Platform,    
  ) { }

  databaseConn() {

    this.platform.ready().then(() => {
      this.sqlite.create({
        name: `${ this.dbName }`,
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        db.executeSql(`CREATE TABLE IF NOT EXISTS ${ this.dbTableOrdes } (
          id INTEGER PRIMARY KEY, 
          id_producto   INTEGER,
          producto      VARCHAR(255),
          ruc_empresa   VARCHAR(13),
          cantidad      INTEGER,
          costo         NUMERIC,
          iva           VARCHAR(1),
          subtotal      NUMERIC,
          iva_valor     NUMERIC,
          iva_costo     NUMERIC,
          total         NUMERIC
        )`, [])
        .then(() => console.log('TABLA ORDERS CREADA CORRECTAMENTE'))
        .catch(e => console.log('error al crear tabla ordes', e));
      })
      .catch(e => console.log('error general',e));
    })

  }

  open() {
    return this.sqlite.create({
      name: `${ this.dbName }`,
      location: 'default'
    })
  }
}
