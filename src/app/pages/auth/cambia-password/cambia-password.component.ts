import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ValidacionRegistrosService } from 'src/app/helpers/validacion-registros.service';

@Component({
  selector: 'app-cambia-password',
  templateUrl: './cambia-password.component.html',
  styleUrls: ['./cambia-password.component.scss'],
})
export class CambiaPasswordComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  
  constructor(
    private modal: ModalController,
    private fb: FormBuilder,
    public validator: ValidacionRegistrosService,
    private dataSrv: AuthService,
    private smsSrv: MessageService,
  ) { }

  ngOnInit() {
    this.form = this.createForm();
  }

  closeModal() {
    this.modal.dismiss({'dismiss' : false});
  } 

  private createForm(){
    return this.fb.group({
      cedula        : [ '', [ Validators.required, Validators.pattern('^[0-9,$]*$'), Validators.minLength(10), Validators.maxLength(13) ] ],
      password        : [ '', [ Validators.required, Validators.minLength(5) ] ],
    });
  }

  changepassword(){

    this.loading = true;

    this.dataSrv.update( this.form.value )
    .subscribe(
      ( res: any) => {
        // this.form.clearAsyncValidators();
        this.loading = false;
        this.modal.dismiss({
          'dismiss' : true
        })   
      },
      ( error => {
        // this.form.clearAsyncValidators();
        this.smsSrv.openError( error );
        this.loading = false;        
      })
      
      
    )

  }

}
