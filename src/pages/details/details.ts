import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, Events, ModalController, Modal, AlertController } from 'ionic-angular'

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class Details {
  navData : any;
  childModal : Modal;
  closeModal : Function;
  constructor(
    private viewController : ViewController, 
    private navParams : NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private events: Events
    ) {
      this.navData = this.navParams.get('data');
      console.log(this.navData);

      events.subscribe('close:details-modal', (data) => {
        this.closeModal();
      });

      this.closeModal = (data) => {
        this.viewController.dismiss(data);
        this.events.unsubscribe('close:details-modal');
      }

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Details');
  }
  
  presentChildModal(modal, data) {
    this.childModal = this.modalCtrl.create(modal, {data: data});
    this.childModal.onDidDismiss(res => {
      if(res) {
        // do your stuff
      }
    });
    this.childModal.present();
  }

  showLocation() {
    this.presentChildModal('MapModal', {isDraggable:false, lat:this.navData.data.reqData[0].latitude, lng:this.navData.data.reqData[0].longitude });
  }

  showImages() {
    if(this.navData.data.images && this.navData.data.images.length > 0) {
      let imgStringArr = this.navData.data.images.map((val, i, arr) => {
        return val.source;
      });
      setTimeout(() => {
        this.presentChildModal('ImageModal', {imgs : imgStringArr, isReadonly : true});
      }, 250);
    } else {
      let presentConfirm = ()=> {
        let alert = this.alertCtrl.create({
          title: 'Info',
          message: 'You have not attached any images to this request !',
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              handler: () => {
                // do nothing
                console.log('Cancel clicked, user is ready to wait');
              }
            }
          ]
        });
        // present
        alert.present();
      }
      presentConfirm();
    }

  }

  editRequest() {
    let data = {
        item : {reqData : this.navData.data.reqData, images : this.navData.data.images},
        isDelete : false
    }
    this.events.publish('update:req', data);
  }

  deleteRequest() {
    let data = {
        id : this.navData.data.reqData[0].service_request_id,
        isDelete : true
    }
    this.events.publish('update:req', data);
  }

}
