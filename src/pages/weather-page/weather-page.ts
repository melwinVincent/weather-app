import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { WeatherAppService } from '../../services/weather.app.services';
import * as HighCharts from 'highcharts';

@IonicPage()
@Component({
  selector: 'page-weather-page',
  templateUrl: 'weather-page.html',
})
export class WeatherPage {
  // used for segment title
  daySelected : string;
  // multi-dimensonal array to manage the data in each segment
  days : any;
  // for high charts
  myChart : any;
  // to store the return data from the weather map api
  data : any;
  constructor(private weatherAppService: WeatherAppService) {
  }
  // format the date into day for better UX
  formatDate(date){
    return new Date(date).toString().split(" ")[0];
  }

  formatTime(time) {
    return time.substr(0,5);
  }

  getData(observableInstance) {
    /*customPsuedoSubscribe returns an Observable and we need to subscribe to that 
      observable to get the data returned using next(), complete() or error() from the Observable in the service
    */ 
    // TODO
    let postObj = {
      lat : "21.4735",
      lon : "55.9754"
    }
    this.weatherAppService.setPostData(postObj);
    this.weatherAppService.customPsuedoSubscribe(observableInstance).subscribe((data)=>{
        // data passed in next comes here
        this.data = data;
        
        // initializing the days array
        this.days = [[]];
        /* loop through the api return data and filter the array returned in api and make an array of arrays. */
        for (var i = 0, j = 0; i < this.data.list.length; i++) {
          // current item
          let dayObj = {
          "date" : this.data.list[i].dt_txt.split(" ")[0],
          "time" : this.formatTime(this.data.list[i].dt_txt.split(" ")[1]),
          "temp" : this.data.list[i].main.temp
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
        this.changeDay(this.formatDate(this.data.list[0].dt_txt.split(" ")[0]), 0);
      console.log(this.days);
    });

  }

  ionViewDidLoad() {
    // call the api
    this.getData('weatherDataObservableLatLng');
  }
  // on clicking the segments
  changeDay(day, index) {
    this.daySelected = day;

    let tempArr = this.days[index].map(item => item.temp);
    let timeArr = this.days[index].map(item => item.time);

    this.myChart = HighCharts.chart('container', {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Temperature Chart'
      },
      xAxis: {
        categories: timeArr
      },
      yAxis: {
        title: {
          text: 'Temperature in degree celcius'
        }
      },
      series: [{
        name: 'Temperature',
        data: tempArr
      }]
    });
  }
}

