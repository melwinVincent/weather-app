import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeatherPage } from './weather-page';

@NgModule({
  declarations: [
    WeatherPage,
  ],
  imports: [
    IonicPageModule.forChild(WeatherPage),
  ],
})
export class WeatherPageModule {}