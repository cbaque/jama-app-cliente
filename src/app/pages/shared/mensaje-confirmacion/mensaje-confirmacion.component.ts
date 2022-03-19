import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mensaje-confirmacion',
  templateUrl: './mensaje-confirmacion.component.html',
  styleUrls: ['./mensaje-confirmacion.component.scss'],
})
export class MensajeConfirmacionComponent implements OnInit {

  constructor(
    public viewCtrl: ModalController,
  ) { }

  ngOnInit() {}


  closeModal(){

    this.viewCtrl.dismiss({
      'dismiss' : true
    })

  }

}
