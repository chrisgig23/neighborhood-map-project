# Neighborhood Maps Project

## My Favorite Restaurants

###### Description
This single page application allows the user to view the various restaurants I've visited and consider to be my favorite. By clicking on a restaurant, either in the list, or directly on the map, the user is presented with the Yelp rating, contact information, and a link to view the full Yelp review on Yelp.com. The user is also able to narrow down the results by searching in a particular area, or by filtering based on the top of cuisine.

## Getting Started
#### Prerequisites
1. Google Chrome
2. Local Web Server (I use SimpleHTTPServer)
  * This requires Python

#### Implementing
1. Run your local web server

  `python -m SimpleHTTPServer`

2. Open up Google Chrome and navigate to the directory served by the command above.  

  <127.0.0.1:8000>

  (This may be different depending on your local environment.)

  ** Please note, due to a security feature in most web browsers, you are unable to access the Yelp data for restaurants if the API is accessed from a local IP. (Cross-origin Request) In order to bypass this, Chrome must be opened in a disabled state. To do so, run the following command in your terminal window.

  `open -n -a /Applications/Google\ Chrome.app --args --user-data-dir="/tmp/someFolderName" --disable-web-security`

3. You can now click on a restaurant name or map marker to view more info about that restaurant, search the map, and filter by cuisine.
