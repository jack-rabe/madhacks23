## Play the game
https://wisgo.tech



Works much better on mobile device.

## Inspiration
In our everyday lives, we tend to get stuck in our daily routing, commutes and classes. 
We want to a game that encourage students to explore the UW campus more. More specifically, we students to actually GO OUTSIDE to NEW PLACES!

## What it does
Its simple web based game that uses the player's location to check if the player has reached the desired location of exploration.
#### How to start the game:
- Go to wisgo.tech
- Enter a username
- Hit play

#### Rules:
From here, the player is shown a Google Maps Street View interactive image of a random location on the UW campus. The player's task to find that location and physically go there. Once the player feels confident that they are at the location, they can submit their guess, and see how close they were. The closer you are, the more points you get.

#### How data is stored
We use MongoDB to store target location coordinates (latitude and longitude). And we use the player's localStorage to save their usernames and the number of guesses they have made. The usernames are also persisted to the MongoDB so we can have a leaderboard.

## How we built it
#### Frontend
- React
- Tailwind CSS


#### Backend and APIs
- NextJS
- Google Maps API
- Geolocation API


#### Database
- MongoDB 

## Challenges we ran into
- Getting the StreetViewPanorama component to render with React was tricky.
- We are not front-end devs, so styling the website was challenging for us.
- Getting an accurate distance between the user location and target location 

## Accomplishments that we're proud of
- Hosting a web server, and getting a custom URL to work
- Getting a video for the background of our main page
- Successfully integrating Google Maps API street view within our website


## What we learned
- NextJS and React
- Tailwind CSS
- MongoDB
- How to host a website and get a custom domain name
- How to use Google Maps API


## What's next for WisGo
- Clean up the UI 
- Add more campus locations in the database
- Do better checking for usernames (make sure they are appropriate)
- Better error  handling
- Improve distance calculation
