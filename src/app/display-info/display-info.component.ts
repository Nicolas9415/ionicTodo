import { Component } from '@angular/core';
import { Events } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-display-info',
  templateUrl: './display-info.component.html',
  styleUrls: ['./display-info.component.scss']
})
export class DisplayInfoComponent {
  item: any = {};
  imageUrl = '';
  imagepath = '';
  constructor(
    public events: Events,
    private file: File,
    private home: HomePage
  ) {
    events.subscribe('display', ev => {
      this.item = ev;
      this.imagepath = `file://${ev.picture}`;
      this.getImagePath();
    });
  }

  async getImagePath() {
    const imageName = this.imagepath.substring(
      this.imagepath.lastIndexOf('/') + 1
    );
    const path = this.imagepath.substring(
      0,
      this.imagepath.lastIndexOf('/') + 1
    );
    await this.file
      .readAsDataURL(path, imageName)
      .then(data => {
        this.imageUrl = data;
      })
      .catch(err => {
        this.imageUrl = undefined;
      });
  }

  backClick() {
    this.home.dismissBackdrop();
  }
  deleteTask() {
    this.home.tasks = this.home.tasks.filter(e => e.task !== this.item.task);
    this.events.publish('delete', this.item._id);
    this.home.dismissBackdrop();
  }
}
