import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListElementComponent } from '../list-element/list-element.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { DisplayInfoComponent } from '../display-info/display-info.component';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [
    HomePage,
    ListElementComponent,
    AddTaskComponent,
    DisplayInfoComponent
  ]
})
export class HomePageModule {}
