import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidacionRegistrosService } from 'src/app/helpers/validacion-registros.service';
import { MessageService } from 'src/app/core/services/message.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { CambiaPasswordComponent } from './cambia-password/cambia-password.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  authForm: FormGroup;
  loading: boolean = false;
  USER: any = null;
  modalChange: HTMLIonModalElement;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public validator: ValidacionRegistrosService,
    private dataSrv: AuthService,
    private smsSrv: MessageService,
    private nativeStorage: NativeStorage,
    private alertController: AlertController,
    public modal: ModalController
  ) {
    this.checkUserLogin();
  }

  ngOnInit() {
    this.authForm = this.createForm();
  }

  ionViewDidEnter(){
    this.checkUserLogin();
  } 

  private createForm(){
    return this.fb.group({
      email        : [ '', [ Validators.required, Validators.pattern('^[0-9,$]*$'), Validators.minLength(10), Validators.maxLength(13) ] ],
      password        : [ '', [ Validators.required, Validators.minLength(5) ] ],
    });
  }
  
  login(){  
    this.loading = true;
    this.dataSrv.post( this.authForm.value )
    .subscribe( 
      ( res ) =>  { 
        this.loading = false;
        this.nativeStorage.setItem('user', res);
        localStorage.setItem('token', JSON.stringify(res.token));
        this.dataSrv.currentUserSubject.next(res.token);
        this.router.navigate(["/tabs/tab1"]);
        this.smsSrv.isLogout.next(false);
      },
      ( error ) => {
        this.smsSrv.openError( error );
        this.loading = false;
      }
    );
  }

  checkUserLogin() {
    this.nativeStorage.getItem('user')
    .then( 
      res => {
      this.USER = res;
      },
      error => {
        console.log( error )
      }
    )
  }

  async logout() {

    const alert = await this.alertController.create({
      header: '¿Seguro de Salir?',
      message: 'Para sus próximos pedidos tiene que iniciar sesión.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          id: 'cancel-button',        
        },{
          text: 'Salir',
          handler: () => {
            this.dataSrv.logout();
            this.USER = null;
            this.smsSrv.isLogout.next(true);            
          }          
        }
      ]
    });

    await alert.present();
  }

  async cambiar() {
    this.modalChange = await this.modal.create({
      component: CambiaPasswordComponent     
    });

    this.modalChange.onWillDismiss().then(
      ( res: any ) => { 
        if ( res.data.dismiss )
          this.smsSrv.openSuccess( 'Usuario actualizado correctamente' )
      }
    );

    return await this.modalChange.present();
  }
  

}
