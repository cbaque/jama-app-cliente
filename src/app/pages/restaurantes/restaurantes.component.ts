import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../core/services/empresa/empresa.service';

@Component({
  selector: 'app-restaurantes',
  templateUrl: './restaurantes.component.html',
  styleUrls: ['./restaurantes.component.scss'],
})
export class RestaurantesComponent implements OnInit {
  LOADING_RESTAURANTES: boolean = false;
  RESTAURANTES: any = [];

  constructor(
    private empresaSrv: EmpresaService
  ) { }

  ngOnInit() {}

  index() {
    this.LOADING_RESTAURANTES = true;
    this.empresaSrv.get().subscribe( res => {
      console.log( 'empresas', res )
      this.RESTAURANTES = res;
      this.LOADING_RESTAURANTES = false;
      
    });
  }

  ionViewDidEnter() {
    this.index();
  }

}
