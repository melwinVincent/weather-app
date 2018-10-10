import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Details } from './details';
import { SharedTranslateModule } from '../../app/app.translate.shared.module';

@NgModule({
  declarations: [
    Details,
  ],
  imports: [
    IonicPageModule.forChild(Details),
    SharedTranslateModule
  ],
})
export class DetailsModule {}
