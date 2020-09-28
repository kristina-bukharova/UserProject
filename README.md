# How to set up and run the UserProject

## ToneAPI

To run the toneAPI, navigate to to the toneAPI folder in terminal and run "python api.py". You will need Python installed to do this. The service will be running at http://localhost:5000. It accepts GET requests at http://localhost:5000/tone and requires no parameters. 

## UserAPI
Before running the userAPI and webApp, you will need to provide .env files for each of those folders.

The .env file for userAPI looks like something like this (pointing to your local Postgres DB instance, and to the toneAPI):
PG_USER=postgres 
PG_HOST=localhost
PG_PASSWORD=password
PG_DATABASE=my_db
PG_PORT=5433
APP_PORT=8080
TONE_API=http://localhost:5000

You must have a table in your database with the name user_info. It should have columns named id, first_name, last_name, and biography_title.

To run the service, navigate to the userAPI folder in terminal, then run "npm install" followed by either:
"npm run start:debug" or
"npm run build" and "npm run start"

The userAPI will be running at http://localhost:8080. You can send GET requests to http://localhost:8080/id to receive a random uuid. You can use this uuid in a POST request to http://localhost:8080/user to create a new user. You will need to provide a request payload that looks like this:
{
    "id": "2e8ae507-e4cf-4c04-aac4-ab0019b9963d",
    "firstName":"Kristina",
    "lastName":"Bukharova",
    "biographyTitle":"Some Title"
}

Afterwards, you will be able to query the user by sending a GET request to http://localhost:8080/user/:id where :id is the uuid you used in the POST request.

## WebApp

The .env file for the webApp folder looks like so (pointing to the userAPI):
APP_PORT=8090
USER_API=http://localhost:8080

To run the service, navigate to the webApp folder in terminal, then run "npm install" followed by either:
"npm run start:debug" or
"npm run build" and "npm run start"

The app will be running at http://localhost:8090. You should see a table of user data. Every time you refresh, a new row will be added and displayed in the table. Notice each record will include a randomly generated biography tone (provided by the toneAPI and sent by the userAPI to the webApp);

Please note you will need to have the toneAPI and userAPI running for the webApp to work. 
