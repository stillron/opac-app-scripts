rootPath = '/PublicChromeDevices/OPACS/';

function openLebDevs() {
  moveDevices(true, 'Lebanon', 'opac');
  moveDevices(true, 'Lebanon', 'ps');
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

function makeMoveLog(device, devType, destOU) {
  Logger.log('Moving %s SN: %s AssetID: %s; Location: %s from %s to %s',
    devType.slice(0, -1),
    device.serialNumber,
    device.annotatedAssetId,
    device.annotatedLocation,
    device.orgUnitPath,
    destOU);
}

function moveDevices(open, deviceLocation, role) {
  // Set source and destination paths
  let sourceOU;
  let destOU;
  let pageToken;
  let devType;
  let onLocationDevs = [];

  const { opacSource, opacDest, psSource, psDest } = isOpening(open);

  if (role === 'opac') {
    sourceOU = opacSource;
    destOU = opacDest;
    devType = 'OPACS'
  } else {
    sourceOU = psSource;
    destOU = psDest;
    devType = 'Patron Stations'
  }

  do {
    let page = getPage(sourceOU);
    let devices = page.chromeosdevices;

    if (devices) {
      onLocationDevs = devices.filter(dev => dev.annotatedLocation === deviceLocation);
    }
    
    if (onLocationDevs.length > 0) {
      for (let i = 0; i < onLocationDevs.length; i++) {
        const device = onLocationDevs[i];
        makeMoveLog(device, devType, destOU);
        AdminDirectory.Customer.Devices.Chromeos.issueCommand({ commandType: "REBOOT" }, 'my_customer', device.deviceId)
        AdminDirectory.Chromeosdevices.update({
          orgUnitPath: destOU,
        }, 'my_customer', device.deviceId)
      }
    } else {
      Logger.log(`No ${devType} found at ${deviceLocation}.`)
      pageToken = page.nextPageToken;
    }
  } while (pageToken)
}