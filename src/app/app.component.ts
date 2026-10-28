import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { ApplicationConfig } from '@angular/core'; 
import { provideHttpClient } from '@angular/common/http'; 
export const appConfig: ApplicationConfig = { 
   providers: [    
    provideHttpClient()  
  ] 
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
