# [Letterboxd Common Films](https://github.com/JenieX/user-js/tree/main/src/user-js/lb-common-films)

## Description

This user script is designed to help you find users on Letterboxd who may have similar movie tastes to yours. When you hover over a user's avatar on supported pages, a list of common movies, along with their ratings, will be displayed.

The script retrieves the rated movies of the target user and filters the list to only include movies that you have watched as well.

## Installation

To use this script, you'll need the [Violentmonkey](https://violentmonkey.github.io) extension installed in your browser. The script has been tested on both Chrome and Edge with Violentmonkey.

Once you have Violentmonkey installed, you can simply click on the following link:

[Install this script](https://github.com/JenieX/user-js/raw/main/dist/lb-common-films/lb-common-films.user.js)

## Usage

After installing the script, it will automatically run on supported pages. Please see the limitations section below for more details.

![Preview](https://github.com/JenieX/user-js/blob/main/src/user-js/lb-common-films/preview/1.gif?raw=true)

The list of common films is color-coded to indicate the level of match between your rating and the user's rating:

- Royal Blue: Perfect match
- Purple: Strong match
- Green: Good match
- Orange: Fair match
- Red: Weak match

Films that you haven't rated will be shown in the default white color.

## Limitations

Currently, the script works only on the members, likes, and fans pages of movies on Letterboxd.

Furthermore, you need to wait for the script to finish retrieving the film data for a user before initiating the process for another user.

This script is designed to work with the current version of Letterboxd as of the script's last update. It may not work with future versions of the site, and may require updates to maintain compatibility.

## History

To see the commit history for this script, click [here](https://github.com/JenieX/user-js/commits/main?path=src/user-js/lb-common-films).

## Contributing

If you'd like to contribute to this script or any other user script by me, feel free to open an issue or submit a pull request [here](https://github.com/JenieX/user-js/issues).

## License

This script is released under the MIT License.
