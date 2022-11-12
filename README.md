# VGER
A web based STO visual glossary. <br>
APP: https://vger.netlify.app <br>
Website: https://stobuilds.com/VGER <br>
<i>At a point in the future I might add a file that describes the structure of the project</i>

## Running locally

```bash
git clone git@github.com:STOCD/VGER.git
cd VGER
npm install
npm run dev # localhost:5173
```
Instead of gloning the repository you can also download it as zip and unpack it.

## Building

```bash
npm run build
npm run preview # localhost:4173
```
VGER is directly deployed from the main branch to netlify. Building does not have to be done manually; netlify does that for us.

## Functionality
VGER consists of five modules: Four Visual Glossary modules for Starship and Ground Traits as well as for  Space and Ground Equipment. Number five is an acronym list for STO-specific acronyms. Each of the visual Glossary sections shows you an image grid with all items of the respective category. Because that's still too much to find a specific item in, I highly encourage to use the filters on the settings menu. You can open it with the hamburger button (three horizontal bars on top of each other) on the rightmost edge of the menu bar. For each module there are some filters you can apply; wherever it makes sense you can even apply multiple filters of the same category. Not applying any filter shows the whole list. 

You can click on any of the cards to open the infobox, that shows about the same information you see when hovering over the item ingame. On VGER the title of any infobox is also a link to the respective wiki page, where you can find more detailed information. A starship traits infobox also shows a list of the ships it is obtained from, which can also be clicked to open the wiki page of that ship.
Another important feature is the search bar. It works in any of the modules and allows you to search for a specific item. In the starship traits section it also automatically searches for the ship names, so typing in a ship's name shows you the trait it comes with. In the other modules it just searches the titles by default, but you can enable searching the descriptions in the settings. This is especially useful if you want to find every console there is that provides a specific stat.
One thing that is not included is a module for Bridge Officer Abilities. While there are quite a lot of them, the wiki has a much better way of presenting them than VGER. On the Boff and kit abilities page there are tables for each profession and specialization with the specific ability's image, at which ranks it is available and how it is obtained. On that page you can also find kit abilities, but those are also represented on VGER through the Kit modules that grant them.

## Automation & API
Constantly there are items added to the game. Manually adding them to VGER would be a tedious task. Luckily there is a source that provides all the data I need, and people that keep it up to date. The STO Wiki. With that in mind, couldn't you just automatically pull the data from the wiki? I can; that's what this final version is all about.
### The Data
Sould I put in a paragraph to explain a backend that nobody cares about? I guess I have to commend myself a bit with this, given that this is the most important feature from my point of view.
The STO Wiki implements a fandom distributed interface called 'Cargo Tables'. This does nothing else than creating a table including all the templates of one kind there are on the wiki. For example there is an Infobox template, that has a number of fields. If you use it to create an infobox, the data you inserted will also show up in the Cargo Table: Infoboxes. The wiki has a lot of such cargo tables, but only three are interesting to me. I (in fact anybody) can download those directly from the wiki, formatted as json file. For VGER they are downloaded by an API (Application Programming Interface) that runs on the same server as VGER. It then extracts the data VGER needs from the tables and formats them in a way that is most efficient for VGER. Whenever somebody opens the url, it requests the data from this API and opens the app. Once the app completely loaded, it sends an asynchronous request to update the data on the API in case there were new items added. Only once every 24h it actually refreshes the data to reduce superfluous network traffic. The initial data request takes anywhere between 0.5 and 3 seconds. In the future I will tweak this a bit to improve the overall performance.
If you're interested in the data, you can call the API yourself to see the data:
https://vger.netlify.app/api - For the refined dataset
https://vger.netlify.app/api?t=1 - For the time of the last data refresh
https://vger.netlify.app/api?t=2 - For the used Cargo Queries
### The images
Bread and Butter of VGER.
Sometimes there might be some images missing. This usually happens due to inconsistent naming between the image files and the infoboxes on the wiki (and in case of the Winter Wonderland items because quotes are not allowed charcters in filenames). If that's the case you can contact me on the STOBuilds Discord in the #vger-support channel (link at the top). 
