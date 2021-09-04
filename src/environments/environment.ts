// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HttpHeaders } from "@angular/common/http";

export const environment = {
  production: false,
  /*nkg 
  * WE NEED DNS CONFIG FOR HOST SERVER
  * WE NEED TO DEPLOY API AS A SERVICE
  * WE NEED TO LOAD ALL EXTERNAL APIs TO BE USED ON THIS SCOPE
  * 
  */
  //nkg Private Cloud Access
  //geniiposapi: 'http://192.168.1.102/api'
  
  //nkg Public Cloud Access
  geniiposapi: 'http://172.16.3.254/api'
};
export const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type':'application/json',
    'Access-Control-Allow-Origin':'*',
    'Accept':'application/json',
    'Authorization': "Bearer " + sessionStorage.getItem("id_token"),
    // 'userid':'1'
  })
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
