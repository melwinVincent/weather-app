# WEATHER APP
Single Page Web app developed using ionic framework 

## DEMO

If you just want to check this project out, you can see the online demo [here](https://weather-app-3b60b.firebaseapp.com/)

## SET UP ##

**Requirements to use this project :**
(*verison in my system is mentioned in brackets*)

Node.js (6.10.3)

npm (6.4.1)

ionic (2.1.18)

Cordova (6.3.1) => *required only if you want to build apk (android app) or ipa (iOS app)*

If you haven't installed ionic and cordova , run these commands

```
npm install cordova ionic -g
```

**Clone the project and checkout to the branch 'master'**

## Install NPM Dependencies

Once you clone this repository, run this command on your terminal to install all needed dependencies:

```
npm install
```

You can launch webapp by running the commad 

```
ionic serve
```

## To Install cordova plugin Dependencies

Run these commands on your terminal to add a platform and install all needed puglins:

### for android

```
cordova platform add android
ionic state restore
```

### for iOS

```
cordova platform add iOS
ionic state restore
```


