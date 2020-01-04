import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HomePage } from '../home/home.page';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  constructor(
    private camera: Camera,
    private home: HomePage,
    private datePicker: DatePicker,

  ) { }
  cameraOptionsMenu = false;
  showDatePickerMenu = false;
  taskDescription = '';
  image = null;
  date = null;

  onTextChange(e: any) {
    if (e.inputType === 'insertText') {
      this.taskDescription += e.data;
    } else {
      this.taskDescription = this.taskDescription.slice(0, -1);
    }
  }
  openDeviceCamera(option: number) {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 900,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: true,
      sourceType: option
    };
    this.camera.getPicture(options).then(
      (imageData: string) => {
        if (imageData.includes('?')) {
          this.image = imageData.substring(7, imageData.indexOf('?'));
        } else {
          this.image = imageData.substring(7);
        }
        this.cameraOptionsMenu = false;
      },
      err => {
        console.log(err);
      }
    );
  }
  showDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'datetime',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
      is24Hour: false,
      minDate: new Date().getTime() 
    }).then(
      dateTime => {
        this.date = dateTime;
      },
      err => console.log('Error occurred while getting dateTime: ', err)
    );
  }
  postTask() {
    if (this.taskDescription !== '') {
      const data = {
        task: this.taskDescription,
        picture: this.image,
        active: false,
        position: this.home.tasks.length,
        date: this.date
      };
      this.home.addTask(data);
      this.closeAll();
    }
  }

  openSubMenu() {
    this.cameraOptionsMenu = true;
  }
  dismissBackdrop() {
    this.cameraOptionsMenu = false;
  }
  closeAll() {
    this.home.dismissBackdrop();
    this.cameraOptionsMenu = false;
    this.showDatePickerMenu = false;
    this.date = null;
    this.image = null;
    this.taskDescription = '';
  }
}
