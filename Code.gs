/**
 * Move all Chromebooks from one OU to another OU
 * 
 * Usage:
 * Replace the `sourceOU` and `destinationOU`
 * with your OU setup, in a format of /OU/SubOU/SubSubOU.
 *
 * © 2021 xFanatical, Inc.
 * @license MIT
 * @version 1.0.0
 */
 rootPath = '/PublicChromeDevices/OPACS/';

 function openLebanonOPACS() {
   moveOPACS(true, 'Lebanon');
 }
 
 function closeLebanonOPACS() {
   moveOPACS(false, 'Lebanon');
 }
 
 function openKiltonOPACS() {
   moveOPACS(true, 'Kilton');
 }
 
 function closeKiltonOPACS() {
   moveOPACS(false, 'Kilton');
 }
 
 function isOpening(opening) {
   if (opening) {
     return {
       opacSource: rootPath + 'Closed',
       opacDest: rootPath + 'Open',
       psSource: rootPath + 'PatronStation/Closed',
       psDest: rootPath + 'PatronStation/Open'
     }
   } else {
     return {
       opacSource: rootPath + 'Open',
       opacDest: rootPath + 'Closed',
       psSource: rootPath + 'PatronStation/Open',
       psDest: rootPath + 'PatronStation/Closed'
     }
 
   }
 }
 
 function getPage(source) {
   let pageToken;
   let page = AdminDirectory.Chromeosdevices.list('my_customer', {
     maxResults: 100,
     pageToken: pageToken,
     orgUnitPath: source,
   })
 
   return {
     page: page,
     token: pageToken
   }
 }
 
 function moveOPACS(open, deviceLocation) {
   // Set source and destination paths
   const { opacSource, opacDest, psSource, psDest } = isOpening(open);
   let FilterLocFn = (chrOSLoc => chrOSLoc.annotatedLocation === deviceLocation);
   let devices = [];
   do {
 
     const opacPage = getPage(opacSource);
     console.log(opacPage)
     if (opacPage.page.chromeosdevices !== undefined ) {
       //devices.push(opacPage.page.chromeosdevices);
<<<<<<< HEAD
       psPage.page.chromeosdevices.map(chromeosdevice => {devices.push(chromeosdevice)})
=======
       opacPage.page.chromeosdevices.map(chromeosdevice => {devices.push(chromeosdevice)})
>>>>>>> c49a9d6 (switched to using map for devices variable population)
       console.log('Found OPAC devices');
     }
     const psPage = getPage(psSource);;
     console.log(psPage);
     if (psPage.page.chromeosdevices !== undefined) {
       console.log(psPage.page.chromeosdevices);
       // devices.push(psPage.page.chromeosdevices);
       psPage.page.chromeosdevices.map(chromeosdevice => {devices.push(chromeosdevice)})
       console.log('Found Patron Station devices');
       console.log(devices);
     }
     //console.log(page);
     // let chromeosdevices = opacPage.page.chromeosdevices
     if (devices.length > 0) {
       let filteredOPACS = devices.filter(FilterLocFn);
       for (let i = 0; i < filteredOPACS.length; i++) {
         const device = filteredOPACS[i]
         // console.log(device);
         Logger.log('Moving chromebook ID: %s; SN: %s AssetID: %s; Location: %s from %s to %s', device.deviceId,
           device.serialNumber,
           device.annotatedAssetId,
           device.annotatedLocation,
           device.orgUnitPath,
           opacDest)
         AdminDirectory.Customer.Devices.Chromeos.issueCommand({ commandType: "REBOOT" }, 'my_customer', device.deviceId)
         AdminDirectory.Chromeosdevices.update({
           orgUnitPath: opacDest,
         }, 'my_customer', device.deviceId)
       }
     } else {
       Logger.log('No chromebooks found.')
     }
     pageToken = opacPage.page.nextPageToken
   } while (pageToken)
 }