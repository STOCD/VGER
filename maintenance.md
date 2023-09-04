# Maintenance
As this app is designed to be maintenance-light, there are only three tasks to perform:
## 1) Acronym updating (on demand)
Whenever there is the need to update the acronym list, follow the instructions below:
1. Download the `xlsx-to-json` folder inside the `accessories` branch of the VGER respository
1. Update the Excel file with the new acronyms (the cells should only be filled with plain text, do not use links)
1. Run the converter (more info in the readme file of the branch)
1. Commit the resulting file named `acronyms.json` in the `/src/data/` folder, replacing the existing file
1. Wait for the host to process te changes
1. Commit the changed Excel file to the `xlsx-to-json` folder inside the `accessories` branch, replacing the existing file
## 2) Image refreshing (on demand)
If it occurs that any images in VGER do not match the current version on stowiki.net, this image has to be manually refreshed. This is **only** necessary when the image on the wiki has been changed after it was firstly cached. In the case that an image does not load in, be patient and allow background processes to cache and serve the image. Waiting 2-3 minutes and then reloading the page should be sufficient if only one image is not loading. More images need more time.

To refresh an image enable maintenance mode in the settings. Then click on the button with the image that should be refreshed and refresh it with the red button at the bottom of the infobox. Stand by as the refresh takes place. When the refresh is done you get alerted with the status code of the process. 200 (or any 2xx status code) means the refresh was successful. Any 4xx or 5xx status code suggest a failure. You can also check on [Github](https://github.com/STOCD/VGER_data) whether the image has been saved correctly.
## 3) Environment variables (Yearly)
This app uses seven environment variables to function properly. These environment variables must be set up at the host providers website. The environment variables can be segmented into two categories:
#### Cache location
The variables `VITE_GITHUB_OWNER` and `VITE_GITHUB_REPO` contain the owner and repository names of the repository used to cache the images. For VGER this is:
```
VITE_GITHUB_OWNER=STOCD
VITE_GITHUB_REPO=VGER_data
```
#### Cache autorization keys
Five keys in total are used to grant access to the app so it can commit new images and data itself. These expire after **one year**. The current keys expire at **`04th of September 2024`**. This setup has to be performed by an STOCD admin that has access to the current hosts page. If it is not performed, VGER will continue to work, but the cache will be static, resulting in no new items being added to the app. For obvious reasons the current keys are not shared here, but a blueprint is:
```
VITE_GITHUB_TOKEN_CARGO=github_xxx_xxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_GITHUB_TOKEN_GROUND_EQUIPMENT=github_xxx_xxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_GITHUB_TOKEN_SPACE_EQUIPMENT=github_xxx_xxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_GITHUB_TOKEN_STARSHIP_TRAITS=github_xxx_xxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_GITHUB_TOKEN_PERSONAL_TRAITS=github_xxx_xxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
