import { Component } from '@angular/core';
import { IonicPage, ModalController, Modal } from 'ionic-angular';
import { WeatherAppService } from '../../services/weather.app.services';
import * as HighCharts from 'highcharts';
import { APP_CONFIG } from '../../app/app.config';
@IonicPage()
@Component({
  selector: 'page-weather-page',
  templateUrl: 'weather-page.html',
})
export class WeatherPage {
  // used for segment title
  city : string;
  daySelected : string;
  segments : string[];
  segmentSelected : string;
  isChart : boolean;
  weatherAppModal : Modal;
  // multi-dimensonal array to manage the data in each segment
  days : any;
  // for high charts
  myChart : any;
  // to store the return data from the weather map api
  data : any;
  constructor(private weatherAppService: WeatherAppService, private modalCtrl : ModalController) {
    this.segments = ["Temperature", "Wind", "Pressue", "Humidity"];
    this.segmentSelected = "Temperature";
    this.isChart = true;
  }
  // format the date into day for better UX
  formatDate(date){
    return new Date(date).toString().split(" ")[0];
  }

  formatTime(time) {
    return time.substr(0,5);
  }

  formatArray() {
    // initializing the days array
    this.days = [[]];
    /* loop through the api return data and filter the array returned in api and make an array of arrays. */
    for (var i = 0, j = 0; i < this.data.list.length; i++) {
        // current item
        let dayObj = {
        "weather" : this.data.list[i].weather[0].description,
        "icon" : APP_CONFIG.imgURL + this.data.list[i].weather[0].icon+'.png',
        "date" : this.data.list[i].dt_txt.split(" ")[0],
        "time" : this.formatTime(this.data.list[i].dt_txt.split(" ")[1]),
        "temp" : this.data.list[i].main.temp,
        "pressure" : this.data.list[i].main.pressure,
        "humidity" : this.data.list[i].main.humidity,
        "wind" : this.data.list[i].wind.speed
      }
    
      /* 
        whenever the dt_txt in the current item is different from the previous item,
        we push an empty array to the days array
      */
      if(i > 0 && this.data.list[i-1].dt_txt.split(" ")[0] !== dayObj.date) {
        j++;
        this.days.push([]);
      }
      // push the dayObj to the respective array of days array
      this.days[j].push(dayObj);
    }
    // load map
    this.changeDay(this.formatDate(this.data.list[0].dt_txt.split(" ")[0]), 0, "Temperature");
    console.log(this.days);
  }

  getData(postObj) {
    /*customPsuedoSubscribe returns an Observable and we need to subscribe to that 
      observable to get the data returned using next(), complete() or error() from the Observable in the service
    */ 

    
    this.weatherAppService.setPostData(postObj);
    this.weatherAppService.customPsuedoSubscribe("weatherDataObservableLatLng").subscribe((data)=>{
        // data passed in next comes here
        
        this.data = data;
        console.log(this.data);
        this.formatArray();
       
    });

  }

  ionViewDidLoad() {
    // call the api
    //this.getData('weatherDataObservableLatLng');
  }
  // on clicking the segments
  changeDay(day, index, segment) {
    this.daySelected = day;

    let arr, title, text, name;
    let timeArr = this.days[index].map(item => item.time);
    
    switch (segment) {
      case "Temperature" : {
        arr = this.days[index].map(item => item.temp);
        title = "Temperature Chart";
        text = "Temperature in degree celcius",
        name = "Temperature"
      break;
      }
      case "Wind" : {
        arr = this.days[index].map(item => item.wind);
        title = "Wind Chart";
        text = "Wind Speed in m/s",
        name = "Wind Speed"
      break;
      }
      case "Pressue" : {
        arr = this.days[index].map(item => item.pressure);
        title = "Pressue Chart";
        text = "Pressue in hectopascals",
        name = "Pressue"
      break;
      }
      case "Humidity" : {
        arr = this.days[index].map(item => item.humidity);
        title = "Humidity Chart";
        text = "Humidity %",
        name = "Humidity"
      break;
      }
    }
    this.myChart = HighCharts.chart('container', {
      chart: {
        type: 'line'
      },
      title: {
        text: title
      },
      xAxis: {
        categories: timeArr
      },
      yAxis: {
        title: {
          text: text
        }
      },
      series: [{
        name: name,
        data: arr
      }]
    });
  }

  changeSegment(segment){
    this.segmentSelected = segment;
    this.changeDay(this.formatDate(this.data.list[0].dt_txt.split(" ")[0]), 0, segment);
  }

  toggleView() {
    this.isChart = !this.isChart;
  }

  getCityData(city) {
    let postObj = {
      city : city
    }
    this.weatherAppService.setPostData(postObj);
    this.weatherAppService.customPsuedoSubscribe('weatherDataObservableCity').subscribe((data)=>{
      console.log(data);
      this.data = data;
      this.formatArray();
    })
  }

    // same function used for showing all the modals in this page
    presentServiceListModal(modal, data) {
      this.weatherAppModal = this.modalCtrl.create(modal, {data: data});
      this.weatherAppModal.onDidDismiss(res => {
        if(res) {
              if(res.latLng.lat) {
                let postObj = {
                  lat :res.latLng.lat.toString(),
                  lon : res.latLng.lng.toString()
                }
                this.getData(postObj);
              }
        }
      });
      this.weatherAppModal.present();
    }
    
  opneMapModal(val) {

        this.presentServiceListModal('MapModal', {isDraggable:true});

    }

}

