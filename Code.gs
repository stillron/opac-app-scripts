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
      patStaSource: rootPath + 'PatronStation/Closed',
      patStaDest: rootPath + 'PatronStation/Open'
    }
  } else {
    return {
      opacSource: rootPath + 'Open',
      opacDest: rootPath + 'Closed',
      patStaSource: rootPath + 'PatronStation/Open',
      patStaDest: rootPath + 'PatronStation/Closed'
    }

  }
}

function moveOPACS(open, deviceLocation) {
  const { opacSource, opacDest, patStaSource, patStaDest } = isOpening(open);
  let FilterLocFn = (chrOSLoc => chrOSLoc.annotatedLocation === deviceLocation);
  let pageToken
  let page
  do {
    page = AdminDirectory.Chromeosdevices.list('my_customer', {
      maxResults: 100,
      pageToken: pageToken,
      orgUnitPath: opacSource,
    })
    //console.log(page);
    let chromeosdevices = page.chromeosdevices
    if (chromeosdevices) {
      let filteredOPACS = chromeosdevices.filter(FilterLocFn);
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
    pageToken = page.nextPageToken
  } while (pageToken)
}