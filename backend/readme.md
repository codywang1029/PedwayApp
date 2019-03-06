# How to run the backend server
### Prerequisites
Must have npm installed  
Inside this directory(in the git repo) run the following bash commands  
```bash
npm install --save-dev nodemon
npm install express --save
npm install
```
You must also have a mongodb instance running  
I recommended using a docker image, but feel free to use your own solution  
This is what I did:
```bash
# Create a mongodb image
docker pull mongo
docker run --name pedmongo --restart=always -d -p 27017:27017 mongo mongod

# connect through local mongo client
mongo

# Now you are connected to the mongodb image
```

### Environment Variable Configuration
Create a `.env` file in the root of the backend directory.
This file will be ignored by git, and should contain any configuration environmental variables.
The following variables are currently supported:
```
# Mongo database password
MONGODB_URI=

# Mongo database username
MONGODB_UNAME=

# Mongo database hostpath
MONGODB_HOST=

# Openroutingservice.org API key
ORS_API_KEY=... 
```

### How to actually run the server
There are two different ways to run the server
```bash
npm start # Runs the prod environment
npm run start-dev # Runs the dev enviornment, recommended for dev
```
