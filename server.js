require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const express = require('express');
const app = express();

// CORS
app.use(
	cors({
		origin: '*',
	})
);
// User authentication
const authentication = require('./middleware/authentication');

// Routes
const authRouter = require('./routes/users');
const familiesRouter = require('./routes/families');

// Error Handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// app.use((req, res, next) => {
// 	res.setHeader('Access-Control-Allow-Origin', '*', 'Get');
// 	next();
// });

app.get('/', (req, res) => {
	res.send('Home');
});

app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
	})
);
app.use(express.json());
app.use(helmet());
app.use(xss());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/families', familiesRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//MongoDB connect
const connectDB = require('./db/connect');

const port = process.env.PORT || 5000;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () => {
			console.log(`listening to port ${port}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();

// TODO: start on project model, controller and routes.
