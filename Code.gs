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
  const source = rootPath + 'Closed';
  const destination = rootPath + 'Open';

  moveOPACS(source, destination, 'Lebanon');
}

function closeLebanonOPACS() {
  const source = rootPath + 'Open';
  const destination = rootPath + 'Closed';

  moveOPACS(source, destination, 'Lebanon');

}



function moveOPACS(sourceOU, destinationOU, deviceLocation) {
  let FilterLocFn = (chrOSLoc => chrOSLoc.annotatedLocation === deviceLocation);
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
      let filteredOPACS = chromeosdevices.filter(FilterLocFn);
      for (let i = 0; i < filteredOPACS.length; i++) {
        const device = filteredOPACS[i]
        // console.log(device);
        Logger.log('Moving chromebook ID: %s; SN: %s AssetID: %s; Location: %s', device.deviceId,
          device.serialNumber,
          device.annotatedAssetId,
          device.annotatedLocation)
        AdminDirectory.Customer.Devices.Chromeos.issueCommand({ commandType: "REBOOT" }, 'my_customer', device.deviceId)
        AdminDirectory.Chromeosdevices.update({
          orgUnitPath: destinationOU,
        }, 'my_customer', device.deviceId)
      }
    } else {
      Logger.log('No chromebooks found.')
    }
    pageToken = page.nextPageToken
  } while (pageToken)
}