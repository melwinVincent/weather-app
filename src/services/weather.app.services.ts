import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoadingController, Loading } from 'ionic-angular';
import { APP_CONFIG } from '../app/app.config';
@Injectable()
export class WeatherAppService {
    // for displaying the loader animation
    loading : Loading;
    // if there is any GET api in the service, we push the observer 'string' to this array (as per our framework)
    activeObservers : Array<string> = [];
    // POST api's should have a data Object (as per our framework)
    postData: any;
    // if there is any POST api in the service, then we need a HttpHeaders (Angular 5) instance (as per our framework)
    headersInstance: HttpHeaders;
    
    /****** all the api's have an Observable object (as per our framework) ******/

    // observable for get API to fetch the todos data
    weatherDataObservableLatLng : Observable<any>;

    // observable for get API to fetch the todos data
    weatherDataObservableCity : Observable<any>;

    /*
        we associate an observer (of type any) for each GET api (as per our framework).
        this is used for cancelling the get api's data binding (refer the cancel function in the service)
        PS : we are not using this cancelling functionality for the time being
    */
    weatherDataObserver : any;
    weatherDataObserverCity : any;


    constructor(
         private http: HttpClient, 
         private loadingCtrl: LoadingController){
        // initialize headersInstance
        this.headersInstance = new HttpHeaders().set('Content-Type', 'application/json')
        
        // observable for GET api
        // this api returns todos objects
        this.weatherDataObservableLatLng = Observable.create(observer => {
            this.presentLoading();
            this.weatherDataObserver = observer;
            this.activeObservers.push('weatherDataObserver');
            // actually this api returns todos objects with username 'test', that's how it is coded in nodejs
            // subscribe to this http.get() to get the data and pass the data to the component
            console.log(this.postData)
            this.http.get(APP_CONFIG.baseUrl+APP_CONFIG.APIKEY+'&lat='+this.postData.lat+'&lon='+this.postData.lon).subscribe(data => {
                    // on success we remove the respective observer reference from the activeObservers array
                    this.removeObserver('weatherDataObserver');
                    this.loading.dismiss();
                    // call the next method pass data to the component
                    observer.next(data);
            }, ()=>{
                // on error we remove the respective observer reference from the activeObservers array
                this.removeObserver('weatherDataObserver');
                this.loading.dismiss();
                console.log("error");
            })
        });

        // observable for GET api
        // this api returns todos objects
        this.weatherDataObservableCity = Observable.create(observer => {
            this.presentLoading();
            this.weatherDataObserver = observer;
            this.activeObservers.push('weatherDataObserverCity');
            // actually this api returns todos objects with username 'test', that's how it is coded in nodejs
            // subscribe to this http.get() to get the data and pass the data to the component
            
            this.http.get(APP_CONFIG.baseUrl+APP_CONFIG.APIKEY+'&q='+this.postData.city).subscribe(data => {
                    // on success we remove the respective observer reference from the activeObservers array
                    this.removeObserver('weatherDataObserverCity');
                    this.loading.dismiss();
                    // call the next method pass data to the component
                    observer.next(data);
            }, ()=>{
                // on error we remove the respective observer reference from the activeObservers array
                this.removeObserver('weatherDataObserverCity');
                this.loading.dismiss();
                console.log("error");
                alert("Can't find this location")
            })
        });

    }

    /******** general methods for the services *********/
    
    // this method is used to sunscribe the Observables in this service from the respective component 
    customPsuedoSubscribe(observableInstance) {
        return this[observableInstance];
    }
    // return the array of active GET Observers
    getObservers() {
        return this.activeObservers;
    }
    // removes the active GET Observer
    removeObserver(observerName) {
        this.activeObservers.splice(this.activeObservers.indexOf(observerName),1);
    }
    // to cancel the GET Obeserver
    cancel(observerName) {
        this.loading.dismiss();
        this.removeObserver(observerName);
        // mark it as complete
        this[observerName].complete();
    }
    // called form the respective component 
    setPostData(postData) {
        this.postData = postData;
    }
    // used for loader
    presentLoading() {
        this.loading = this.loadingCtrl.create({
        content: 'Loading ...'
        });
        this.loading.present();
    }

    hideLoading() {
        this.loading.dismiss()
    }
}