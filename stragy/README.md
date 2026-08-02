# Stragy App

Here is my stragy app, an app that encorporates te functionalities of both Strava and Dragy.
First, create the relevant directories, and then make sure that its all ready to be used.
After creating repos, run: npm install, npm install react react-dom, npm create vite@latest. - In that specific order.
Wiring up the back end: python3 -m venv env (or whatever name you'd like your ependencies to have.)
- pip install flask, pipenv install, pipenv shell, pip requirements > requirements.txt.

After all this is done, we are ready to start coding!

Stragy is a full-stack app that combines ideas from Strava and Dragy. It is built with a Flask backend and a Vite/React frontend.

## Project Overview

This project is split into two main parts:

- Frontend: the user interface built with React and Vite
- Backend: the API and business logic built with Flask

## Folder Structure

A clean project structure should look like this:

```text
stragy/
├── client/
│   └── stragy/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.js
├── server/
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   ├── seed.py
│   ├── routes/
│   ├── services/
│   └── utils/
└── README.md
```

## What should go in the server folder?

Your server folder should be organized so that each part has one clear job.

### 1. app.py
Use this file to create and run the Flask app.
It should:
- create the app
- register routes or blueprints
- initialize extensions
- run the app locally

### 2. config.py
Use this file for app settings.
It should hold values such as:
- database settings
- secret keys
- environment-specific config

### 3. extensions.py
Use this file for Flask extensions.
Examples include:
- database connection
- migration tools
- CORS
- authentication helpers

### 4. seed.py
Use this file to add sample data during development.
This is helpful when you want to test the app quickly.

### 5. routes/ or blueprints
Create a folder for your API endpoints.
Each feature should have its own route file, for example:
- user routes
- trip routes
- driving stats routes

### 6. services/
Put your business logic here.
This keeps your routes simple and makes your code easier to maintain.

### 7. utils/
Use this folder for helper functions.
Examples include:
- validation
- formatting
- error helpers
- reusable utility functions

## Setup Instructions

### Frontend setup
Run these commands in the correct order:

```bash
npm install
npm install react react-dom
npm create vite@latest
```

### Backend setup
Create a Python environment and install the needed packages:

```bash
python3 -m venv env
pip install flask
pipenv install
pipenv shell
pip freeze > requirements.txt
```

## Development Workflow

After the setup is complete, start building the app in this order:

1. Create the server structure
2. Set up the Flask app and configuration
3. Add routes and controllers
4. Connect the database models
5. Build the frontend pages
6. Connect frontend to backend API

## Next Step

Keep your app organized by making sure each folder has a single responsibility. This will make the project easier to grow later.
