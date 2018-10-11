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
## Sample apk (android app)
Download sample android apk from [here](https://drive.google.com/open?id=1yzUavoSO8i_OEfHcAIyT0-Vuog6JELvx)


## Enable choosing the location from Google maps in localhost server

You can choose the location from google maps as input in localhost server by just uncommenting a few lines of code. On clicking the **CHOOSE FROM MAP** button, a popup modal opens to choose the location.

*In the hosted server it is not loading due to some issues with the lazy loading feature implemented in this application. This loading issue could have been fixed if one more day was given*

To enable this google maps feature => **uncomment the lines 31 to 38 in weather-page.html** and run ionic serve

