import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, ToastController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard' ;
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
// services
import { MemoryService } from '../services/memory.service';
import { CacheMemoryService } from '../services/cache.memory.service';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;
  // to prevent alert stacking, check registerBackButtonAction function
  alertPresented: boolean = false;
  // array of page references to be iterated in menu
  menuPages : Array<String>
  // to manage i18n
  language : string;
  /* 
    https://blog.angular-university.io/angular-viewchild/
  */
  // reference to ion-nav in app.html, this logic is as per our framework
  @ViewChild(Nav) navCtrl: Nav;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    keyboard : Keyboard,
    events: Events, 
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private memoryService: MemoryService,
    private cacheMemoryService: CacheMemoryService,
    private translateService: TranslateService,) {
    
    this.rootPage = 'WeatherPage'

    events.subscribe('set:root', (page) => {
      // set root
      this.navCtrl.setRoot(page);
    });

    if(this.cacheMemoryService.get("language")) {
      translateService.setDefaultLang(this.cacheMemoryService.get("language"));
      this.language = this.cacheMemoryService.get("language");
      if(this.language === 'ar') {
        document.body.classList.add('ar');
        platform.setDir('rtl', true);
      }
    } else {
      translateService.setDefaultLang('en');
      this.cacheMemoryService.set('language', 'en');
      this.language = 'en';
    }
    // to add a css class to the body and chnage the language in cache on clicking a button from UI
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      if(this.translateService.currentLang === 'en') {
        document.body.classList.remove('ar');
        platform.setDir('ltr', true);
        this.cacheMemoryService.set('language', 'en');
      } else {
        document.body.classList.add('ar');
        platform.setDir('rtl', true);
        this.cacheMemoryService.set('language', 'ar');
      }
      platform.setLang(this.cacheMemoryService.get("language"), true);
    });

    // on platform ready
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      //keyboard.disableScroll(false);
      //keyboard.hideKeyboardAccessoryBar(true);
      if(platform.is('ios')){
        statusBar.overlaysWebView(false);
        keyboard.disableScroll(true);
        keyboard.hideKeyboardAccessoryBar(false);

        keyboard.onKeyboardShow().subscribe((e) => {
            console.log(e.keyboardHeight);
            if(!this.memoryService.getData().keyboardHeight) {
              this.memoryService.updateLocalMemory('keyboardHeight', e.keyboardHeight);
              var style = document.createElement('style');
              style.type = 'text/css';
              style.innerHTML = '.keyboard-is-open { height: calc(100% - '+e.keyboardHeight+'px) }';
              document.getElementsByTagName('head')[0].appendChild(style);
              document.body.classList.add('keyboard-is-open');
            } else {
              document.body.classList.add('keyboard-is-open');
            }
        });

        keyboard.onKeyboardHide().subscribe((e) => {
            console.log(e)
            document.body.classList.remove('keyboard-is-open');
        });
        
      }
    });
    
    /******* subscribing to events from the child pages ******/

    events.subscribe('page:push', (page, obj) => {
      // open the page
      let navObj = obj ? obj : {};
      this.openPage(page, navObj);
    });
    // subscribing the pop event
    events.subscribe('page:pop', () => {
      this.popView();
    });
    // subscribing the toast event
    events.subscribe('toast', (msg, duration) => {
      this.presentToast(msg, duration);
    });

    // subscribing the scroll-into-view event
    events.subscribe('scroll-into-view', (id) => {
      document.getElementById(id).scrollIntoView();
    });

    events.subscribe('language:change', (lang) => {
      // change language
      this.changeLanguage(lang);
    });

    // for displaying in side menu
    this.menuPages = [
      'WeatherPage'
    ];

    // on clicking the device back button in android
    // logic - v-01-alpha
    platform.registerBackButtonAction(() => {

      const loadingView = this.navCtrl._app._appRoot._loadingPortal._views[0];
      const modalView = this.navCtrl._app._appRoot._modalPortal._views[0];
      const overlayView = this.navCtrl._app._appRoot._overlayPortal._views[0];
      // first dismiss the loading
      if(loadingView && loadingView.dismiss) {
        // we skip dismissing the loader for post request, use memoryService to check whether any active post requests are running
        // TODO : need to set a timeout for the post requests
        if (this.memoryService.getData().isPostObserverActive.length > 0) {
          // do nothing
          console.log("active post is running");
        } else {
          // timeout is put for better UX
          setTimeout(()=>{
            // present the alert, ask the user whether he want to stay or leave and then dismiss if he choose to leave
            let presentConfirm = ()=> {
              // on presenting make the alertPresented to true, this is to avoid alert stacking up on continuous back button click 
              this.alertPresented = true;
              let alert = this.alertCtrl.create({
                title: 'Leave !',
                message: 'Do you want to leave the page or stay ?',
                buttons: [
                  {
                    text: 'Stay',
                    role: 'cancel',
                    handler: () => {
                      // do nothing
                      console.log('Cancel clicked, user is ready to wait');
                      // on closing alertPresented should be set to false
                      this.alertPresented = false;
                    }
                  },
                  {
                    text: 'Leave',
                    handler: () => {
                      // call the poping function
                      // on closing/leaving alertPresented should be set to false
                      this.alertPresented = false;
                      loadingView.dismiss();
                      this.popView();
                    }
                  }
                ]
              });
              // present
              alert.present();
            }
            // only display an alert after checking alertPresented, this is to avoid stacking up
            if(!this.alertPresented) {
              presentConfirm();
            }
          },250);
        }

      } else if (modalView && modalView.dismiss) {
        // only for loading view we ask the confirmation to go back, for modal and overlay views we just dismiss them
        modalView.dismiss();
      } else if (overlayView && overlayView.dismiss) {
        overlayView.dismiss();
      } else {
        // if there is no loading, modal or overlay, then call the poping function
        this.popView();
      }
    });

  } // end of contructor

  // for toasting a message
  presentToast(msg, duration) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duration ? duration : 3000,
      position: 'middle',
      showCloseButton : true,
      cssClass: 'ttct-toast'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  // for pushing a page
  openPage(page, obj) {

    if (this.navCtrl.getActive().component.name !== page) {
      // for setting the component, called in the switc-case
      let setComponent = () => {
        // clear the stack if the routing is to HomePage (in this application HomePage is the rootPage)
        if (page === 'HomePage') {
          this.navCtrl.setRoot('HomePage');
        } else {
          // setRoot or push can be used depending on the requirement
          this.navCtrl.push(page, obj);
        }
      
      }
      // check the current active component and then only set the new one
      switch(this.navCtrl.getActive().component.name) {
        case 'TodosPage' : {
          // do your logic
          console.log("Opening TodosPage");
          setComponent();
          break;
        }
        case 'SecondPage' : {
          // do your logic
          console.log("Opening SecondPage")
          setComponent();
          break;
        }
        default : {
          setComponent();
          break;
        }
      }
          
    }
  }

  /*
      function used for poping out the view, 
      called on clicking the backbutton on the header, on clicking the device back button in android and on subscribing the pop events
      if there is an overlay (backdrop), user wont be able to click the back button on the header
  */
  popView() {
    // used fat arrow to skip self = this dirty logic, function called from siwtch cases. We deal with 'this' so always use fat arrows as a thumb rule
    let pop = () => {
      if(this.navCtrl.canGoBack()){
        this.navCtrl.pop();
      } else {
        // exit the app if it returns back to rootPage
        navigator['app'].exitApp();
      }
    }
    
    let presentConfirm : Function;
    // check the active component
    switch (this.navCtrl.getActive().component.name) {

      case 'Signin':
      case 'HomePage':
         presentConfirm = () => {
            let alert = this.alertCtrl.create({
            title: 'Exit !',
            message: 'Are you sure about exiting ?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'YES',
                handler: () => {
                  // call the local function to pop
                  pop();
                }
              }
            ]
          });
          alert.present();
        }
        presentConfirm();
      break;
      // default is always pop
      default: {
        pop();
        break;
      }
    }
  }
  // for language change
  changeLanguage(lang) {
    console.log("lang is : ", lang);
    this.translateService.use(lang);
    this.language = lang;
  }
}

