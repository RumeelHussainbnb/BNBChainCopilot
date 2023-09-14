#  BNB Chain Copilot

The BNB Chain Copilot is aimed at making the development on BNB Chain eaiser for new users. We aim to incorporate ChatGPT-4 to answer queries related to BNB Chain (theoratical concepts or development). With Web3 wallet integration (walletconnect), it would be easier to keep track of the number of users we have onboarded. 

> **Note:**
> Currently we have only implemented integration with Chatpgt 3.5 Turbo model, however, in future we aim to finetune it to provide better information about the BNB Chain.

## Pre-requisites
To successfully run this project on your local machine, make sure you fulfill the following requirements. 

#### Software Requirements
* NPM v9.5.1 or above
* [Nodejs](https://nodejs.org/en/download/current) v18.14.2 or above
* [MongoDB Compass](https://www.mongodb.com/try/download/compass) v1.39.3 or above
* [MongoDB Atlas](https://www.mongodb.com/atlas) for creating database and getting connection string

## Project Setup
* Clone this repo using the command `git clone https://github.com/RumeelHussainbnb/BNBCopilot.git`
* Rename the file `.env.example` to `.env`
* Update the `OPENAI_API_KEY` in the `.env` file with your OPENAI keys. You can get OPENAI keys from [here](https://platform.openai.com/account/api-keys). Create new if you dont have exisiting.

## MongoDB Setup
* Navigate to [MongoDB Atlas](https://www.mongodb.com/atlas), create a new project and a database named `ChatGPTDB`. If required add two collections `Chats` and `Rooms`.
* Copy the connection string of the database.
* In the [db.js](./backend/db.js) update the connection string with the connection string for your mongodb database.

## Running the Project Locally
To run the project locally, run the following commands
* `npm install` to install all of the dependencies.
* `npm run dev` to run the app in the development mode.
* Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

