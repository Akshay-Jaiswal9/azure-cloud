const { Connection, Request } = require("tedious");
const express = require("express");
const prompt = require("prompt-sync")();
const bcrypt = require("bcryptjs");

const download = require('download'); // isko download kr

const { BlobServiceClient } = require("@azure/storage-blob");
var azure = require('azure-storage');

const account = "azurestoragedrive";
const sas = "sv=2020-08-04&ss=b&srt=sco&sp=rwdlactfx&se=2022-11-10T06:29:43Z&st=2021-11-09T22:29:43Z&sip=150.129.168.8&spr=https&sig=TfQL%2B%2Ft6XuNr1DeJ4sbbFS9WtGnjkHtOzvudQNNrBzo%3D"
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net?${sas}`);
const blobServiceClient2 = BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=azurestoragedrive;AccountKey=9gJFBBUVn6Cp04R4ZwAqKgxSB63bcisO+5G7VK+GSxVFn1o8HMYEkgWhWcEfPosAqaJW7NyIt5Z3nhBT4lXwzw==;EndpointSuffix=core.windows.net");

var blobService = azure.createBlobService("DefaultEndpointsProtocol=https;AccountName=azurestoragedrive;AccountKey=9gJFBBUVn6Cp04R4ZwAqKgxSB63bcisO+5G7VK+GSxVFn1o8HMYEkgWhWcEfPosAqaJW7NyIt5Z3nhBT4lXwzw==;EndpointSuffix=core.windows.net");



const saltRounds = 10;
let r = false;                  // for login
let s = false;                  // for signup
let m = false;                  // for metadata
let d = false;                  // for delete
let df = false;
let loginError = "";
let signupError = "";
let metadataError = "";
let deleteError = "";
let downloadError = "";

let username = "";

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "bossguy", // update me
      password: "6AdMCa44dQcHSeA", // update me
    },
    type: "default",
  },
  server: "test123098.database.windows.net", // update me
  options: {
    database: "test1", //update me
    encrypt: true,
  },
};

// ################################################################################################################################

const signup = (email, uname, mno, pcode) => {
  username = ""; s=false;
  const connection = new Connection(config);

  // Attempt to connect and execute queries if connection goes through
    connection.on("connect", (err) => {
      if (err) {
        console.error(err.message);
        signupError="Connection Error!";
        s = false
      } else {
        registerDatabase();
      }
    });

connection.connect();

function registerDatabase() {
  bcrypt.hash(pcode, saltRounds, (err, hash) => {
    if (err) {
      console.error(err)
      signupError="Unable to register!"
      s = false
      return
    }

    console.log("Reading rows from the Table...");
    // Read all rows from table
    const request = new Request(
      `insert into [dbo].[logindb] (UserName,Passcode,Email,MobileNumber) values('${uname}','${hash} ','${email}',${mno})
      
    `,
      (err, rowCount) => {
        if (err) {
          console.error(rowCount-1, err.message);
          signupError="username/email already exist!"
          s = false
        } else {
          console.log(`${rowCount-1} row(s) returned`);
          s=true;
          username=uname;
        }
      }
    );

    request.on("row", (columns) => {
      columns.forEach((column) => {
        console.log("%s\t%s", column.metadata.colName, column.value);
      });
    });

    connection.execSql(request);
  });
}
console.log('signup hua!');
}
const signupSuccess = () => {       // signup export
  if (s){
    try {
      // var conName = prompt("Enter Container Name : "); // idhar uname aaiga
      console.log("Creating container...");
      //const conClient=blobServiceClient2.getContainerClient(username);
      console.log(`Creating Container "${username}"...`);
      //conClient.create();
      
      
      blobService.createContainerIfNotExists(username.toLowerCase(), {
        publicAccessLevel: 'Container'
      }, function(error, result, response) {
      if (!error) {
         console.log(result)
         console.log(`Done.`); 
      } else {
          console.log(result)
      }
    });
    }
    catch (error) {
      console.log(error);
    }
  }
  return {result: s, error: signupError};
}

// ################################################################################################################################

const login = (uname, pcode) => {

  const connection = new Connection(config);

  // Attempt to connect and execute queries if connection goes through
  connection.on("connect", (err) => {
    if (err) {
      console.error(err.message);
      loginError = err;
    } else {
      loginDatabase();
    }
  });


  connection.connect();


  function loginDatabase() {
    // var uname = prompt("Username: ");
    // var pcode = prompt("Password: ");
    console.log("Reading rows from the Table...");

    // Read all rows from table
    const request = new Request(
      `select [dbo].[logindb].[Passcode] from [dbo].[logindb] where UserName = '${uname}'
    `, function (err, result) {
      if (err) {
        console.error(err.message);
        loginError = err;
      }

      if(result > 0){
        console.log("User Exist")
      } else {
        console.log("User Does not exist")
        loginError = "User Does not exist"
        r = false;
      }
    });

    request.on("row", (columns) => {
      columns.forEach((column) => {
        console.log("%s\t%s", column.metadata.colName, column.value);
        bcrypt.compare(pcode, String(column.value.trim()), function (error, result) {
          if (result) {
            console.log("Success! ", result);
            r=result;
            // console.log("Success");
          } else {
            console.log("Incorrent UserName / Password");
            loginError = "Incorrent UserName / Password";
            r = false;
          }
        });
      });
    });
    connection.execSql(request);
    // setTimeout(() => {console.log(r);}, 2000)
  }
//   return r;
}
const bachalo = () => {             // login export: isne bacha liya
  return {result: r, error:loginError};
}

// ################################################################################################################################

const uploadMetaData = (uname,BlobName) => {
  let blobName = BlobName.trim()
  const connection = new Connection(config);

  // Attempt to connect and execute queries if connection goes through
  connection.on("connect", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      uploadMetaData();
    }
  });


  connection.connect();

  async function uploadMetaData() {
    m = false;

    //var uname = prompt("Username: ");     // username - container name
    //var blobName = prompt("FileName: ");  // blob name - file name

    const containerClient = blobServiceClient2.getContainerClient(uname);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    var blockblob= containerClient.getBlobClient(blobName);
    console.log(blockBlobClient.url);

    var blobURL=blockBlobClient.url;

    

    var lastModified = (await blockblob.getProperties()).lastModified;  //for the blob
    var versionId = (await blockblob.getProperties()).versionId;     // for the blob
    var contentMD5 = (await blockblob.getProperties()).contentMD5;
    // Read all rows from table
    const request = new Request(
      `insert into [dbo].[filedb] (UserName,fileName,filehash,versionID,lastDateModified,fileURL) values('${uname}','${blobName}','${contentMD5}','${versionId}','${lastModified}','${blobURL}') 
      `,
      (err, rowCount) => {
        if (err) {
          console.error(err.message);
        } else {
          m = true;
          console.log(`${rowCount} row(s) returned`);
        }
      }
    );

    request.on("row", (columns) => {
      columns.forEach((column) => {
        console.log("%s\t%s", column.metadata.colName, column.value);
      });
    });

    connection.execSql(request);
  }

}
const uploadMetaDataSuccess = () => {
  return {result: m, error: metadataError};
}

// ################################################################################################################################

// uploadMetaData("tenz", "game.exe")

const deleteContainerFiles = (uname,blobName) => {        // for deleteing the file in the container for the specific username
  d = false;
  const connection = new Connection(config);

  // Attempt to connect and execute queries if connection goes through
  connection.on("connect", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      deleteFile();
    }
  });

  connection.connect();
  
  async function deleteFile() {
      try {
        //var uname = prompt("Username: ");     // username - container name
        //var blobName = prompt("FileName: ");  // blob name - file name

        const containerClient = blobServiceClient2.getContainerClient(uname);
        var blockblob= containerClient.getBlobClient(blobName);
        var versionId = (await blockblob.getProperties()).versionId;     // for the blob 
        const blobDeleteResponse = containerClient.deleteBlob(blobName)
        console.log((await blobDeleteResponse).clientRequestId);
        console.log("File Deleted Successfullyfrom Container!!!!! ");

       
        
        const request = new Request(
          `DELETE FROM [dbo].[filedb] where versionID='${versionId}'  
          `,
          (err, rowCount) => {
            if (err) {
              console.error(err.message);
            } else {
              d = true;
              console.log(`${rowCount} row(s) returned`);
              console.log("File Deleted Successfully From SQL Database!!!!! ");
            }
          }
        );
        request.on("row", (columns) => {
          columns.forEach((column) => {
            console.log("%s\t%s", column.metadata.colName, column.value);
          });
        });
    
        connection.execSql(request);

      } catch(error) {
          console.log(error);
      }
  }


}
const deleteSuccess = () => {
  return {result: d, error: deleteError};
}




const downloadFile = (uname,blobName) => {

  const containerClient = blobServiceClient2.getContainerClient(uname);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  console.log(blockBlobClient.url);
  
  var blobURL=blockBlobClient.url;
  console.log("Downloading in C-drive: Azure-Blob-Downloads");
  try{
    download(blobURL,"C://Azure-Blob-Downloads");
    df = true;
  }
  catch(err) {
    downloadError = err.getMessage();
    df = false;
  }
}

const downloadSuccess = () => {
  return {result: df, error: downloadError};
} 

module.exports = { 
  login, bachalo, 
  signup, signupSuccess,
  uploadMetaData, uploadMetaDataSuccess,
  deleteContainerFiles, deleteSuccess,
  downloadFile, downloadSuccess 
};
