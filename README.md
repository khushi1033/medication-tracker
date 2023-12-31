# Do-It-Daily

This is a tracker for medication. It tracks medication info, sends alerts for taking/refilling/expiring medication. 

### Function Application Description
The app is designed as a calendar app for tracking different medications. Set up through the Nylas API, the app can sign in users through Google OAuth and pair their Google Calendar to their account on our application. The user information is also directed to a database in MongoDB modeled with mongoose. When users create a medication they can add in when they want their reminder, name it, add a description, and add other pertinent information like dosage, total doses in the prescription, and total doses that have already been taken to help facilitate medication tracking. The extra information unused in the Google Calendar API is separated and only stored in the MongoDB database. The application only shows medication reminders for the next 7 days but users can upgrade to premium and see all medication reminders. 


### User Stories
  #### All Users
  * As a user, I want to create an account with my email so that I can start using the "Do It Daily" app.
  * As a user, I want to log in to my account using my credentials so that I can access my medication information and receive personalized alerts.
  * As a user, I want to add a new medication to my account, specifying medication details: instructions on how to take the medication, dosage, and schedule, to ensure I stay on top of my medical regimen.
  * As a user, I want to view a calendar displaying my upcoming prescriptions and dosage schedule, so I can easily track and plan my medication routine.
  * As a user, I want to review my medication history from the last month on Google Calendar, tracking my adherence and any missed doses for improved health management.
  * As a user, I want to upgrade my account to a premium, unlocking additional features and benefits.
  * As a user, I want to receive alerts through Google Calendar for taking my medications, so that I can remember to take my medication on time.
  #### Paid Users
  * As a paid user, I want to see all of my medication reminders at once.

### Tech Stack
#### Backend Development
* Node.js
* Express.js

#### User Interface Development
* HTML/CSS
* JavaScript
* React.js

#### API Integration/Frameworks
Nylas
* Google Calendar API
* Google OAuth

#### Database, Deployment, and Hosting
The app uses MongoDB on MongoDB Atlas with mongoose modeling. 

const UserSchema = new Schema({
  _id: String,
  email: { type: String, unique: true, required: true },
  medications: [MedicationSchema],
});

const MedicationSchema = new Schema({
  _id: String,
  medicationName: String,
  medicationDosage: String,
  totalDoses: Number,
  medicationDetails: String,
  dosesTaken: Number,
});

### Interactive UI
Users are able to sign in, add medications to their Google Calendar, and save extra information using our application 

## Install and Run Instructions

### Backend

#### Requirements
- Node 18.0.0 or later (see [checking the Node version](#checking-the-nodejs-version))
- [a .env file with your Quickstart app secrets](#set-up-your-env-file)

#### Set up your `.env` file
Refer to the provided `.env.example` to see how to set up your `.env` file

##### Nylas Credentials
Go to the Nylas Dashboard, and choose the Quickstart Application.
Click **App Settings** to see the `client_id` and `client_secret` for the Quickstart app.
Add these to a `.env` in the backend directory as in the example below.
```yaml
# Nylas application keys - see https://developer.nylas.com/docs/developer-guide/authentication/authorizing-api-requests/#sdk-authentication
CLIENT_ID=client_id...
CLIENT_SECRET=client_secret...
```
##### MongoDb Credentials
You need to have a MongoDB server running before launching the application.
Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Click the green **Try Free** button and create an account
- Click on the green **Create** button underneath "Create a deployment"
- Select the free **M0** configuration.
- Give Cluster a name and click on the green **Create** button
- Now, to access your database you need to create a DB user. You should have been redirected to the **Quickstart** tab in the **Security** section on the left-hand side of the webpage.
- Create a new Mongo user with credentials of your choice
- Add `0.0.0.0/0` to your IP Access List in the menu below the user creation menu.
- Press `Finish and Close`. This will redurect you back to your **Overview** section.
- Click on **Connect** in the **Database Deployments** card in the **Overview** section.
- In the new screen, select **Node.js** as Driver and version **5.5 or later**.
- Finally, copy and add the URI connection string the `.env` in the backend directory.  Make sure to replace the <PASSWORD> with the db User password that you created under the Security tab.


#### Install Node dependencies
Run the following commands in the backend directory to install the Node dependencies

```bash
npm install
npm install --save nylas
```

#### Run the backend server locally
Start the backend server before you start the frontend. You will need two terminal sessions so you can run both at the same time. Run the following command in the backend directory

```bash
npm start
```

Your backend server is now running on `localhost:9000` and you can now make API calls, or start a frontend to run on top of it

### Frontend

### Install Node dependencies
Run the following commands in the frontend direcotry to install the Node dependencies for this frontend.

```bash
npm install
npm install --save @nylas/nylas-react
```

### Confirm that a backend is running
Start a backend server before you start the frontend. You will need two terminal sessions so you can run both at the same time.
Confirm that a backend API server is running on [http://localhost:9000](http://localhost:9000)

### Run the frontend server locally
Start the frontend client by running the following command in the frontend directory.

```bash
npm start
```

Visit the frontend client at [http://localhost:3000](http://localhost:3000) to try it out!


## More information on Nylas API 
You will use the [Nylas API](https://developer.nylas.com/docs/getting-started/what-is-nylas/#what-is-nylas) as a way to the calendar, create medication, and manage medications. Nylas provides an integration layer that connects and syncs email, calendar, and contact data.

## More details on using the tracker 
Enter your email, follow the authentication steps, if needed. Once logged in, fill in the medication name, date, and explanation to add a medication.

If the medication is due to be taken in more than a week,
* And you have a basic account, the new medication will not show up in the list view.
* And you have an upgraded account, the new medication will show up in the list view.

To switch between upgraded and basic account, select the upgrade button in the top right of the page then click the refresh button to view your updated medications list.

The list view is also connected to the google calendar, menaing you can go to google calendar associated with the email you used to sign up and view your medications reminders there as well.
