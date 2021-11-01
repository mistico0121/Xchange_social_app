const fs = require('fs');
const path = require("path");
const { storage } = require('pkgcloud');
const storageConfig = require('../config/storage');

const CONTAINER_NAME = 'iic2513-groupimgs';

class FileStorage {
  constructor() {
    try {
      this.client = storage.createClient(storageConfig);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Cloud file storage service could not be initialized. No upload or download support will be available. Error: ${e.message}`);
      this.noClientError = new Error('No cloud file storage service available');
    }
  }

  upload(fileData) {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        reject(this.noClientError);
      } else {
        console.log("HAY CLIENTE\n");
      }

      var extension = path.extname(fileData.name);
      const remote = fileData.name;

      const writeStream = this.client.upload({ 
        container: CONTAINER_NAME, 
        contentType: 'image/png',
        remote });

      /*
      const writeStream = this.client.upload({ 
          container: CONTAINER_NAME,
          //meta: {
          //  contentType:"image/png"
          //},
          remote });

      if (extension == ".png"){
        

        
      } else if (extension == ".jpg"){
        console.log("eeeee");
        const writeStream = this.client.upload({ 
          container: CONTAINER_NAME,
          //meta: {
          //  contentType:"image/png"
          //},
          remote });
      }*/

      writeStream.on('error', reject);
      writeStream.on('success', resolve);
      const fileStream = fs.createReadStream(fileData.path);
      fileStream.pipe(writeStream);
    });
  }

  download(remotePath) {
    if (!this.client) {
      return Promise.reject(this.noClientError);
    }
    return this.client.download({ container: CONTAINER_NAME, remote: remotePath });
  }
}

function renameImage(filename, newfilename){
  var extension = path.extname(filename);
  var name 
  name.concat(newfilename, extension)
  fs.rename('filename', name, (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
}

module.exports = new FileStorage();
