// THIS IS SAMPLE CODE ONLY - NOT MEANT FOR PRODUCTION USE
import { BlobServiceClient} from '@azure/storage-blob';

const sasToken = process.env.storagesastoken || "sv=2020-08-04&ss=b&srt=sco&sp=rwdlactfx&se=2023-11-15T08:35:27Z&st=2021-11-11T00:35:27Z&sip=0.0.0.0-255.255.255.255&spr=https&sig=ww7FtjOJm3SllsZua0rh1vhbl3pnIyr6DoxYoM3f%2FQg%3D"; // Fill string with your SAS token
let containerName = ``;
const storageAccountName = process.env.storageresourcename || "azurestoragedrive"; // Fill string with your Storage resource name

// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = (USERNAME) => {
  containerName = USERNAME;
  return !((!storageAccountName || !sasToken));
};

// return list of blobs in container to display
const getBlobsInContainer = async (containerClient) => {
  const returnedBlobUrls = [];

  // get list of blobs in container
  // eslint-disable-next-line
  for await (const blob of containerClient.listBlobsFlat()) {
    // if image is public, just construct URL
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
    );
  }

  return returnedBlobUrls;
};


const createBlobInContainer = async (containerClient, file) => {
  
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadBrowserData(file, options);
  await blobClient.setMetadata({UserName : 'azCloudPro'});
};

const uploadFileToBlob = async (file) => {
  if (!file) return [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  // get Container - full public read access
  const containerClient = blobService.getContainerClient(containerName);

  // upload file
  await createBlobInContainer(containerClient, file);

  // get list of blobs in container
  return getBlobsInContainer(containerClient);
};

const listFiles = () => {
    const blobService = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    );
    const containerClient = blobService.getContainerClient(containerName);
    return getBlobsInContainer(containerClient);
}
// </snippet_uploadFileToBlob>

const funcs = {
  uploadFileToBlob,
  listFiles
}

export default funcs;

