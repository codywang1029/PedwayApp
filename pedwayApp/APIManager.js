/**
 * Singleton class that handles all the API calls for the peddwayApp
 * reference: https://facebook.github.io/react-native/docs/network
 * reference: https://stackoverflow.com/questions/44719103/singleton-object-in-react-native
 * @type {{}}
 */

export default class APIManager  {

    static instance = null;
    isProduction = true;

    static getInstance() {
        if (APIManager.instance == null) {
            APIManager.instance = new APIManager();
        }
            return this.instance;
    }

    getCurrentPedwayStatus() {
        return fetch('https://pedway.azurewebsites.net/api/status', {method: 'GET'}).
        then(response=>response.json());
    }

};

// module.exports = APIManager;