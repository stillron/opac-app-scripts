rootPath = '/PublicChromeDevices/OPACS/';

function openLebDevs() {
  moveDevices(true, 'Lebanon','opac');
  moveDevices(true, 'Lebanon','ps');
}

function closeLebDevs() {
  moveDevices(false, 'Lebanon', 'opac');
  moveDevices(false, 'Lebanon', 'ps');
}

function openKiltonDevs() {
  moveDevices(true, 'Kilton', 'opac');
  moveDevices(true, 'Kilton', 'ps');
}

function closeKiltonDevs() {
  moveDevices(false, 'Kilton', 'opac');
  moveDevices(false, 'Kilton', 'ps');
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

return page;
}

function moveDevices(open, deviceLocation, role) {
  // Set source and destination paths
  let sourceOU;
  let destOU;
  let pageToken;
  
  const { opacSource, opacDest, psSource, psDest } = isOpening(open);
  
  if (role === 'opac') {
   sourceOU = opacSource;
   destOU= opacDest;
  } else {
    sourceOU = psSource;
    destOU = psDest;
  }
  
  do {
    let page = getPage(sourceOU);
    let devices = page.chromeosdevices;

    if (devices) {
    let onLocationDevs = devices.filter(dev => dev.annotatedLocation === deviceLocation);
    for (let i = 0; i < onLocationDevs.length; i++) {
      const device = onLocationDevs[i];
      Logger.log('Moving chromebook ID: %s; SN: %s AssetID: %s; Location: %s from %s to %s', device.deviceId,
        device.serialNumber,
        device.annotatedAssetId,
        device.annotatedLocation,
        device.orgUnitPath,
        destOU)
      AdminDirectory.Customer.Devices.Chromeos.issueCommand({ commandType: "REBOOT" }, 'my_customer', device.deviceId)
      AdminDirectory.Chromeosdevices.update({
        orgUnitPath: destOU,
      }, 'my_customer', device.deviceId)
    }
  } else {
    if (role === 'opacs') {
      devType = 'OPACS'
    } else {
      devType = 'Patron Stations'
    }
    Logger.log('No '+ devType +' found at ' + deviceLocation+ '.')
  pageToken = page.nextPageToken;
}
} while (pageToken)
}