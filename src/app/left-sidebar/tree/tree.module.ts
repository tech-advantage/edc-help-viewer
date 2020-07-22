import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './tree.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [TreeComponent],
  exports: [TreeComponent],
})
export class TreeModule {}
