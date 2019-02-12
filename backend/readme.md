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
docker run --name pedmongo --restart=always -d -p 27017:27017 mongo mongod --auth

# Open bash terminal to this image
sudo docker exec -i -t pedmongo bash

# connect to local mongo
mongo

# create the first admin user
use admin
db.createUser({user:"foouser",pwd:"foopwd",roles:[{role:"root",db:"admin"},{role:"root",db:"pedway"}]})

# exit the mongo shell
exit
# exit the container
exit

# now you can connect with the admin user (from any mongo client >=3 )
#  remember to use --authenticationDatabase "admin"
mongo -u "foouser" -p "foopwd" localhost --authenticationDatabase "pedway"
# Now you are connected to the mongodb image
```
### How to actually run the server
There are two different ways to run the server
```bash
npm start # Runs the prod environment
npm run start-dev # Runs the dev enviornment, recommended for dev
```
