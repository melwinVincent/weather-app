import {Injectable} from '@angular/core';

@Injectable()
export class MemoryService {
    private data : any = {};
    
    constructor(){
        this.data['isPostObserverActive'] = [];
    }

    updateLocalMemory(attr:string, val:any){        
        this.data[attr] = val;
    }
    // this method is used to push the reference string of POST Observers to the isPostObserverActive array of this service
    // this is used to control the back button action in the registerBackButtonAction in app.component.ts
    updatePostObservers(observerName:string, isActive:boolean){
        if(isActive) {
            this.data.isPostObserverActive.push(observerName);
        } else {
            this.data.isPostObserverActive.splice(this.data.isPostObserverActive.indexOf(observerName),1)
        }
    }

    getData() {
        return this.data;
    }
    
}