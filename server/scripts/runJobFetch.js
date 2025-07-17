require('dotenv').config();
const connectDB = require('../config/db');
const fetchJobs = require('../jobs/fetchJobs');

const run = async () => {
    await connectDB();
    await fetchJobs();
    process.exit(0);
};

run();
