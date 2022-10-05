function openLebDevs() {
  moveDevices(true, 'Lebanon');
}

function closeLebDevs() {
  moveDevices(false, 'Lebanon');
}

function openKiltonDevs() {
  moveDevices(true, 'Kilton');
}

function closeKiltonDevs() {
  moveDevices(false, 'Kilton');
}

function getPaths() {
  let rootPath = '/PublicChromeDevices/OPACS';
  var ous = AdminDirectory.Orgunits.list('my_customer', { orgUnitPath: rootPath, type: 'all' });
  return ous.organizationUnits.filter(ou => ou.name === 'Closed');
}

function getPage(source) {
  let pageToken;
  let page = AdminDirectory.Chromeosdevices.list('my_customer', {
    maxResults: 100,
    pageToken: pageToken,
    orgUnitPath: source,
  });
  return page;
}

function makeMoveLog(device, destOU) {
  Logger.log('Moving %s; SN: %s; Location: %s; from %s to %s',
    device.annotatedAssetId,
    device.serialNumber,
    device.annotatedLocation,
    device.orgUnitPath,
    destOU);
}

function moveUnitsDevices(ou, deviceLocation, opening) {
  let sourceOU;
  let destOU;
  let pageToken;
  let onLocationDevs = [];

  if (opening) {
    sourceOU = ou.orgUnitPath;
    destOU = ou.parentOrgUnitPath;
  } else {
    sourceOU = ou.parentOrgUnitPath;
    destOU = ou.orgUnitPath;
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
        makeMoveLog(device, destOU);
        AdminDirectory.Customer.Devices.Chromeos.issueCommand({
           commandType: "REBOOT" 
          }, 'my_customer', device.deviceId)
        AdminDirectory.Chromeosdevices.update({
          orgUnitPath: destOU,
        }, 'my_customer', device.deviceId)
      }
    } else {
      Logger.log(`No ${deviceLocation} devices found in unit ${sourceOU}`)
      pageToken = page.nextPageToken;
    }
  } while (pageToken)
}

function moveDevices(open, deviceLocation) {
  const paths = getPaths();
  paths.forEach(path => moveUnitsDevices(path, deviceLocation, open));

}