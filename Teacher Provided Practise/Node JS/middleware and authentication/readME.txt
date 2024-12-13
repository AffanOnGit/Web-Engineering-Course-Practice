Steps to run the project:
//1. make folder
//2. npm init -y
//3. npm install express jsonwebtoken dotenv body-parser --save
//4. create .env file in the folder and paste your secret key in it like this -> SECRET=your_secret_key_here
//5. in the app.js file copy and paste the code from the app.js file of the provided folder and run the project
//6. send the curl command using terminal -> curl.exe -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{\"email\":\"user@example.com\",\"password\":\"password123\"}'
//7. send get request using the postman, paste your token there, url-> http://localhost:3000/accessResource2