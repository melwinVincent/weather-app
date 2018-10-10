import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { APP_CONFIG } from '../../app/app.config';
import { Geolocation } from '@ionic-native/geolocation';
import { MemoryService } from '../../services/memory.service';
import { CacheMemoryService } from '../../services/cache.memory.service';

declare var google;
@IonicPage()
@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html',
})
export class MapModal {

  latLng : any;
  navData : any;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor( private viewController : ViewController, private navParams : NavParams, public geolocation: Geolocation, private memoryService : MemoryService, private cacheMemoryService : CacheMemoryService) {
    // should be set in the constructor (before the DOM is set) to access the data in DOM
    this.navData = this.navParams.get('data');
    console.log("constructor")
}

  ionViewDidLoad() {
    // this.navData = this.navParams.get('data');
    // should be called in didLoad, this method actually makes some DOM manipulation, so this should be called after load
    if(this.navData.lat && this.navData.lng) {
        this.showMap(
          this.navData.lat, 
          this.navData.lng
        );
    } else {
      this.loadMap();
    }
  }

  closeModal(isCancel) {
    // the data is saved to the memory only if user clicks OK button after choosing the option to mark a differnt location from map
    if(!(isCancel) && this.navData['isDraggable']) {
      this.memoryService.updateLocalMemory('latLng', this.latLng);
    } else {
      // clearing the object to be passed as data to the parent component
      this.latLng = {};
    }
    let data =  {
      modal : 'MAP',
      latLng : this.latLng
    }
    this.viewController.dismiss(data);
  }

  showMap(lat, lng) {
    this.latLng = {
        lat : lat,
        lng : lng
      }
    let latLng = new google.maps.LatLng(lat, lng);
        let mapOptions = {
          center: latLng,
          zoom: APP_CONFIG.zoom,
          mapTypeId: google.maps.MapTypeId.SATELLITE
        }
  
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMarker();
  }

  loadMap(){
    // only shown when user choose to mark a differebnt location from map
    if(this.memoryService.getData().latLng && this.memoryService.getData().latLng.lat && this.navData['isDraggable']) {
      this.showMap(this.memoryService.getData().latLng.lat, this.memoryService.getData().latLng.lng);
    } else {
      // get the registered location
      if(this.navData['isBASE']) {
        // get details from the login response
        this.showMap(
          this.cacheMemoryService.getJSON('loginResponse').latitude, 
          this.cacheMemoryService.getJSON('loginResponse').longitude
        );
      } else {
        // get the current location
        this.geolocation.getCurrentPosition().then((position) => {
          this.showMap(position.coords.latitude, position.coords.longitude);
        }, (err) => {
          console.log(err);
        });
      }
      
    }
 
  }
  // called after map is loaded
  addMarker(){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      draggable: this.navData['isDraggable'] ? true : false,
    });    

    google.maps.event.addListener(marker, 'dragend', (event) => {
      console.log(event.latLng.lat());
      this.latLng = {
        lat : event.latLng.lat(),
        lng : event.latLng.lng()
      }
      console.log("here");
    });

  }
  




}
