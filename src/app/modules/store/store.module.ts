import { NgRelaxModule } from './../../ng-relax/ng-relax.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';

@NgModule({
  imports: [
    CommonModule,
    StoreRoutingModule,
    NgRelaxModule
  ],
  declarations: [ListComponent, UpdateComponent],
  entryComponents: [UpdateComponent]
})
export class StoreModule { }
