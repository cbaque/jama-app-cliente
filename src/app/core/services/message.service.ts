import { Injectable } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  isLoading = new BehaviorSubject(false);
  isNewOrder = new BehaviorSubject(false);
  isLogout = new BehaviorSubject(false);
  
  loading;
  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) { }

  async openModalOffline() {
    const toast = await this.toastController.create({
      message: 'Verifique conexión a red',
      duration: 3000,
      color: 'warning',
      icon: 'information-circle',
      buttons: [{
          text: 'OK',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]      
    });
    toast.present();
  }

  async openSuccess( sms: string = null) {
    const toast = await this.toastController.create({
      message: sms,
      duration: 3000,
      color: 'dark',
      icon: 'checkmark-done-circle',
      buttons: [{
          text: 'OK',
          role: 'cancel',
          handler: () => {
          }
        }
      ]      
    });
    toast.present();
  }

  async openError( sms: string = null) {
    const toast = await this.toastController.create({
      message: sms,
      duration: 5000,
      color: 'danger',
      icon: 'close',
      buttons: [{
          text: 'OK',
          role: 'cancel',
          handler: () => {
          }
        }
      ]      
    });
    toast.present();
  }

  async openLoading() {

    this.loading = await this.loadingController.create({
      message: 'Por favor espere...',
      // duration: 2000
    });
    await this.loading.present();
  }

  closeLoading() {
    this.loading.dismiss();
  }
}
