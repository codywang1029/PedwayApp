/**
 * Singleton class that handles all the API calls for the peddwayApp
 * reference: https://facebook.github.io/react-native/docs/network
 * reference: https://stackoverflow.com/questions/44719103/singleton-object-in-react-native
 * https://pusher.com/tutorials/persisting-data-react-native
 * @type {{}}
 */
const Realm = require('realm');
const apiServerURL = 'https://pedway.azurewebsites.net/api/status';


export default class APIManager {

  static instance = null;
  static realm = null;
  isProduction = true;

  static getInstance() {
    if (null == APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return this.instance;
  }

  getCurrentPedwayStatus() {
    return fetch(apiServerURL, {method: 'GET'}).then(response => response.json()).catch((e)=> {
      console.log(e);
    });
  }


  saveToDataBase(inputSchema, inputData) {
    Realm.open({schema: [inputSchema]}).then(
      (inputRealm) => {
        inputRealm.write(() => {
          inputRealm.create(inputSchema['name'], inputData);
          APIManager.realm = inputRealm;
        });
      }
    );
  }

  readFromDataBase(inputSchemaName) {
    if (this.realm === null) {
      return [];
    }
    return this.realm.objects(inputSchemaName)
  }

};

// module.exports = APIManager;