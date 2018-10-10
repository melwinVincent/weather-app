import {Injectable} from '@angular/core';

@Injectable()
export class CacheMemoryService {
    
    private ls : any = {};
    
    constructor(){

        this.ls =  this.isLocalStorageNameSupported() ? window.localStorage : {};
    }
    isLocalStorageNameSupported() {
        try {
            var supported = window.localStorage;
            if (supported) {
                window.localStorage.setItem("storage", "");
                window.localStorage.removeItem("storage");
                return true;
            }
            return false;
        }
        catch(err) {
            if(window.localStorage.length==0 && err.code === DOMException.QUOTA_EXCEEDED_ERR) {
                /*
                    * User in private mode
                    * Do nothing
                    */

                return false;
            }
            throw err;
        }
    }

    

    
        set (key, value) {

               this.ls[key] = value;

            };

            get (key) {

                return this.ls[key];

            }

            getJSON (key) {

                var json = this.ls[key];

                if(json) {

                    return(JSON.parse(json));

                }

                return {};

            }

            setJSON (key, value) {

                this.ls[key] = JSON.stringify(value);

            }

            getSetJSON (key, value) {
                if (this.ls[key]) {
                    return JSON.parse(this.ls[key]);
                }
                this.ls[key] = JSON.stringify(value);
                return value;
            };

            unSet (key) {

                delete this.ls[key];

            };

            getSet (key, def) {

                if (this.ls[key]) {
                    return this.ls[key];
                }

                this.ls[key] = def;
                return this.ls[key];

            };

}









