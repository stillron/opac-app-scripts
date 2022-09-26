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
  let FilterLocFn = (chrOSLoc => chrOSLoc.device.annotatedLocation === deviceLocation);
  let deviceList = [];
  do {

    const opacPage = getPage(opacSource);
    console.log(opacPage)
    if (opacPage.page.chromeosdevices !== undefined) {
      console.log(opacPage.page.chromeosdevices);
      // devices.push(psPage.page.chromeosdevices);
      opacPage.page.chromeosdevices.map(chromeosdevice => { deviceList.push({ device: chromeosdevice, ouDest: opacDest }) })
      console.log('Found OPAC Device');
    }
    const psPage = getPage(psSource);
    console.log(psPage);
    if (psPage.page.chromeosdevices !== undefined) {
      console.log(psPage.page.chromeosdevices);
      // devices.push(psPage.page.chromeosdevices);
      psPage.page.chromeosdevices.map(chromeosdevice => { deviceList.push({ device: chromeosdevice, ouDest: psDest }) })
      console.log('Found Patron Station devices');
    }
    //console.log(page);
    // let chromeosdevices = opacPage.page.chromeosdevices
    if (deviceList.length > 0) {
      let filteredOPACS = deviceList.filter(FilterLocFn);
      for (let i = 0; i < filteredOPACS.length; i++) {
        const device = filteredOPACS[i].device;
        const destination = filteredOPACS[i].ouDest;
        // console.log(device);
        Logger.log('Moving chromebook ID: %s; SN: %s AssetID: %s; Location: %s from %s to %s', device.deviceId,
          device.serialNumber,
          device.annotatedAssetId,
          device.annotatedLocation,
          device.orgUnitPath,
          destination)
        AdminDirectory.Customer.Devices.Chromeos.issueCommand({ commandType: "REBOOT" }, 'my_customer', device.deviceId)
        AdminDirectory.Chromeosdevices.update({
          orgUnitPath: destination,
        }, 'my_customer', device.deviceId)
      }
    } else {
      Logger.log('No chromebooks found.')
    }
    pageToken = opacPage.page.nextPageToken
  } while (pageToken)
}