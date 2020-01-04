// tslint:disable: quotemark
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, Events } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';

import 'hammerjs';
import { Observable } from 'rxjs';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  active = true;
  tasks = [];
  displayItem = {};
  addTaskVisible = false;
  displaInfo = false;
  address = '';
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(
    private http: HttpClient,
    private statusBar: StatusBar,
    public platform: Platform,
    private http2: HTTP,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public events: Events,
    private fcm: FCM
  ) {
    this.statusBar.backgroundColorByHexString('#A9A9A9');
    this.statusBar.styleLightContent();
    this.platform.pause.subscribe(() => {
      this.tasks.forEach(task => {
        if (task._id) {
          this.http2.put(
            `https://backendthesis.herokuapp.com/data/${task._id}`,
            task,
            {}
          );
        } else {
          this.http2.post(
            `https://backendthesis.herokuapp.com/data/`,
            task,
            {}
          );
        }
      });
    });
    this.platform.resume.subscribe(() => {
      this.http2
        .get('https://backendthesis.herokuapp.com/data', {}, {})
        .then(e => {
          const data = JSON.parse(e.data);
          data.sort((a: any, b: any) => a.position - b.position);
          this.setTasks(data);
        })
        .catch(error => {
          console.log(error);
        });
      this.getGeolocation();
    });
    events.subscribe('delete', id => {
      if (id) {
        this.http2.delete(
          `https://backendthesis.herokuapp.com/data/${id}`,
          {},
          {}
        );
      }
    });
  }

  getGeolocation() {
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
      })
      .catch(error => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  getGeoencoder(latitude: number, longitude: number) {
    this.nativeGeocoder
      .reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.address = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  generateAddress(addressObj: any) {
    return `${addressObj.thoroughfare}#${addressObj.subThoroughfare} ${addressObj.administrativeArea},${addressObj.countryName}`;
  }

  ngOnInit() {
    if (this.platform.is('android')) {
      this.getTasksMobile().then(e => {
        const data = JSON.parse(e.data);
        data.sort((a: any, b: any) => a.position - b.position);
        this.tasks = data;
      });
    } else {
      this.getTasksDesktop().subscribe(e => (this.tasks = e));
    }
    this.getGeolocation();

    this.fcm.getToken().then(token => {
      console.log(token);
    });
    this.fcm.subscribeToTopic('push');
  }
  onPause() { }

  getTasksDesktop(): Observable<any> {
    return this.http.get('https://backendthesis.herokuapp.com/data');
  }
  getTasksMobile() {
    return this.http2.get('https://backendthesis.herokuapp.com/data', {}, {});
  }

  onTitleClick(action: boolean) {
    if (this.active && !action) {
      this.active = !this.active;
    } else if (!this.active && action) {
      this.active = !this.active;
    }
  }
  emptyText() {
    return this.active
      ? 'You have no pending tasks'
      : "You haven't compleated any task yet";
  }
  checkRenderItems() {
    const data = this.tasks.filter(e => {
      return !e.active === this.active;
    });

    return data;
  }

  checkIfCanreorder() {
    return this.checkRenderItems().length <= 1;
  }
  swipeEvent(swipe: any) {
    swipe.deltaX > 30 ? (this.active = true) : (this.active = false);
  }

  reorder(ev: any) {
    ev.detail.complete();
    const itemToMove = this.tasks.splice(ev.detail.from, 1)[0];
    this.tasks.splice(ev.detail.to, 0, itemToMove);
    this.checkRenderItems().forEach((task, i) => {
      task.position = i;
    });
  }
  dismissBackdrop() {
    this.addTaskVisible = false;
    this.displaInfo = false;
  }

  floatingBtnCLick() {
    this.addTaskVisible = true;
  }
  addTask(task: any) {
    task.location = this.address;
    this.tasks.push(task);
  }

  setTasks(data: any) {
    this.tasks = data;
  }
  displayInfo(ev: any) {
    this.displaInfo = true;
    this.displayItem = ev;
    this.events.publish('display', ev);
  }

  getItemToDisplay() {
    return this.displayItem;
  }
}
