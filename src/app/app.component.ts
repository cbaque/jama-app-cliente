import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ConectionService } from './core/services/offline/conection/conection.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private conOffline : ConectionService,
    private platform: Platform,   
  ) {
    this.platform.ready().then(() => {
      document.body.setAttribute('data-theme', 'dark');
      document.body.classList.toggle('dark', true);      
      this.conOffline.databaseConn();
    });

  }
}
