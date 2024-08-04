require('dotenv').config();
const app = require('./app');
const connectDB = require('./db');
const PORT = process.env.PORT;

if(process.env.NODE_ENV === 'production') {
    async function startServer() {
        try {
            const dbConnection = await connectDB(); // Ensure DB is connected before starting the server
            app.locals.db = dbConnection; // Attach the DB connection to the app locals if needed

            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        } catch (error) {
            console.error('Failed to start the server:', error);
        }
    }

    startServer();
}