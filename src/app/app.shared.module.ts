import { NgModule } from '@angular/core';
import { MyInputDirective } from '../directives/my-input.directive';
@NgModule({
  declarations: [ MyInputDirective ],
  exports: [ MyInputDirective ]
})
export class SharedModule {}