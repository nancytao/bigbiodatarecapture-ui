# bigbiodatarecapture-ui

To view the UI: 

Install NPM. On Linux, you can do this by running the following commands in a terminal shell. 
```
sudo apt-get update
sudo apt-get -y install node npm 
```

Install MongoDB and start an instance of MongoDB. 
```
sudo apt-get update
sudo apt-get -y install mongodb
sudo service mongodb stop
sudo mkdir $HOME/db ; sudo mongod --dbpath $HOME/db --port 80 --fork --logpath /var/tmp/mongodb
```

Navigate to a directory to where you want to save this repository. 
```
git clone https://github.com/BigBioRecapture/Main.git
cd Main 
npm install 
npm start 
```

Go to localhost:8080 in your browser. 