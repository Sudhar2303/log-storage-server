# Log Storage Service
This project Log-Storage-Server is designed to efficiently buffer input data and store it securely in an Amazon S3 bucket. The application is fully containerized using Docker, ensuring seamless deployment and scalability

Github Link : https://github.com/Sudhar2303/log-storage-server.git

Docker Image : https://hub.docker.com/r/sudhar23/log-storage-server

# Features
* **Data Buffering**: Buffers incoming data before uploading to the S3 bucket for optimized performance.
* **S3 Storage** : Securely stores buffered data in an Amazon S3 bucket.
* **Docker Containerization** : Provides an isolated environment for running the server, simplifying deployment and dependency management
  
## Running Locally
Step 1: Prerequisites

Check if Node.js and npm are installed:
```
node -v
npm -v
```
Step 2: Clone the Project

Clone the project to your local machine
```
git clone https://github.com/Sudhar2303/log-storage-server.git
cd log-storage-server
```
Step 3: Install Dependencies

Install required npm packages
```
npm install
```
Step 4: Set up Environment variable

Create a .env file in the project root directory with following content
Put the value based on the your s3 bucket and MongoDB_URL.
```
DB_URL=mongodb+srv: mongodb-url
PORT=3500

BUCKET_NAME=bucket-name
BUCKET_REGION=region
BUCKET_ACCESS_KEY=key
BUCKET_SECRET_KEY=secret-key
```
Step 5: Start the Application

To Run the server
```
npm start
```

## Run Using Docker
Step 1: Prerequesties

Check if Docker is installed
```
docker --version
```

Step 2: Build Docker Image

If windows user, make sure you opened Docker Desktop
```
docker build -t log-storage-server:latest .
```

Step 3: Set up Environment variable

Create a .env file in the project directory with the value based on the your s3 bucket and mongoDB_URL.

Step 4: Run the Docker Container

Run the Docker using the built image with .env file
```
docker run -p 3500:3500 --env-file .env log-storage-server
```

## Usage

Open the terminal and Send data to the server endpoint for store the log:
```
curl -X POST http://localhost:3500/api/v1/log -d '{"event_name": "login"}'
```
The server will buffer the data and upload it to the configured S3 bucket.

## Scripts
Run Load-Test :
Run LoadTest built using loadtest package
```
npm run load-test <number-of-request>
```
Replace values in place of number-of-request
