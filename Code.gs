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

function openLebanonOPACS() {
    const source = '/PublicChromeDevices/OPACS/Closed';
    const destination = '/PublicChromeDevices/OPACS/Open';

    moveOPACS(source, destination);
}

function closeLebanonOPACS() {
    const source = '/PublicChromeDevices/OPACS/Open';
    const destination = '/PublicChromeDevices/OPACS/Closed';

    moveOPACS(source, destination);

}


 
 
 function moveOPACS(sourceOU, destinationOU) {
   let pageToken
   let page
   do {
     page = AdminDirectory.Chromeosdevices.list('my_customer', {
       maxResults: 100,
       pageToken: pageToken,
       orgUnitPath: sourceOU,
     })
     //console.log(page);
     let chromeosdevices = page.chromeosdevices
     if (chromeosdevices) {
       for (let i = 0; i < chromeosdevices.length; i++) {
         const chromeosdevice = chromeosdevices[i]
         console.log(chromeosdevice);
         Logger.log('Moving chromebook ID: %s; SN: %s AssetID: %s; Location: %s', chromeosdevice.deviceId, 
         chromeosdevice.serialNumber, 
         chromeosdevice.annotatedAssetId, 
         chromeosdevice.annotatedLocation)
         AdminDirectory.Customer.Devices.Chromeos.issueCommand({commandType:"REBOOT"},'my_customer',chromeosdevice.deviceId)
         AdminDirectory.Chromeosdevices.update({
           orgUnitPath: destinationOU,
         }, 'my_customer', chromeosdevice.deviceId)
       }
     } else {
       Logger.log('No chromebooks found.')
     }
     pageToken = page.nextPageToken
   } while (pageToken)
 }