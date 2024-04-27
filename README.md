# This branch is a copy of the main branch with changed adapter settings to allow for a direct deployment to netlify. Do not merge this branch.

<hr>

# VGER
## About

VGER (**V**isual **G**lossary for **E**asy **R**eference) is a web-based glossary for Star Trek Online.<br>
APP: https://vger.netlify.app <br>
Website: https://stobuilds.com/VGER <br>

## Functionality
VGER consists of five modules: Four Visual Glossary modules for Starship and Personal Traits as well as for  Space and Ground Equipment. Number five is an acronym list for STO-specific acronyms. Each of the visual Glossary sections shows you an image grid with all items of the respective category. Because that's still too much to find a specific item in, it is highly encouraged to use the filters on the settings menu, which is opened with the hamburger button (three horizontal bars on top of each other) on the rightmost edge of the menu bar. For each module there are several filters available; it is possible to mix and match the filters. Not applying any filter shows the entire list. 

Clicking on any of the cards opens the infobox, that shows about the same information you see when hovering over the item ingame. On VGER the title of any infobox is also a link to the respective wiki page, where you can find more detailed information. A starship traits infobox also shows a the cost of the trait as well as a list of the ships it is obtained from, which can also be clicked to open the wiki page of that ship.

The search bar works for all five modules, but in slightly different ways. In the Acronym module it searches the acronym, term and description fields. In the Starship and Personal Traits module it searches titles and descriptions likewise. Searching for a starship also shows the trait(s) it comes with. The Equipment modules are only title-searched by default, but searching descriptions can be enabled in the settings. *On all five modules, searching for an acronym will also show the respective item.*

# Environment variables

Following environment variables should be set:
```
# Docker config
VGER_DATA_FOLDER_PATH=./vger_data
VGER_PORT=47
VGER_VERSION=2.0.0

# app config
VITE_DATA_FOLDER_PATH=/vger_data
```
*The shown values are example values that work, but might not yield the desired result.*

- `VGER_DATA_FOLDER_PATH` sets the path of the cache folder on the host (when deploying with docker)
- `VGER_PORT` sets the port that the app will be accessible through from the outside (when deploying with docker)
- `VGER_VERSION` is used to tag the docker image (when deploying with docker)
- `VITE_DATA_FOLDER_PATH` sets the path that the app uses to cache the data
    - for development it is recommended to use `./vger_data` to keep data and app close
    - for deployment with docker this is the path to the cache folder *inside* the container and it must be an absolute path; it is recommended to use `/vger_data`

# Development

Make sure to install an adequate version of Node.js first (^v20.[...].[...]). Download or clone the repository. Run the following commands:
- Installation: `npm install`
- Running the development server: `npm run dev` -> open the specified location in your browser to see the current result
The development server is reactive, meaning it will instantly update any saved changes to the apps source code while running.

# Deploying
## Building & Preview

To build the app, first make sure to set the correct adapter in `svelte.config.js`. Change the adapter name in the first line to `adapter-node` when deploying via Docker or to `adapter-netlify` when deploying to netlify.
- run `npm run build` to build the app
- run `npm run preview` and open the specified location in your browser to see a local preview of your built app

## Docker

- download or clone the repository to the host machine
- change the adapter to `adapter-node`
- create an enviroment variables file and populate it
    - make sure the specified data folder exists on the host machine and is empty
- run `docker compose up -d` to build and launch the app
- run `docker compose down` to stop and delete the app
- run `docker compose start -d` to launch the app in case it has already been built
- run `docker compose stop` to stop the running app without deleting it

## Netlify
*Currently, VGER is being deployed to netlify from the `netlify-deploy` branch.*
- change the adapter to `adapter-netlify`
- create a new site on the netlify website
- set the environment variables in the netlify dashboard
- select the correct node version in the netlify dahboard
- select the repository and branch to pull from
    - if the build doesn't work by default, make sure that the build command is `npm run build` and the publish directory `build`.

# API

Four APIs are used by the app to retrieve its data; those are also accessible from the outside:
- `/acronyms` -> returns json data containing the acronyms and their terms and descriptions
- `/api/starshiptraits`, `/api/traits`, `/api/equipment` -> returns data for the respective module
    - parameter `query` can be set to `source` to retrieve the cargo queries used to get the data from the wiki; not supplying it or setting it to `data` returns the data
    - parameter `override` can be set to `fresh` to return a newly created version of the data or to `cached` to return the cached dataset; not supplying it returns the cached data, but also updates the cache if the data is older than one day
