const { Queue } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null
});

const jobQueue = new Queue('job-importer-queue', {
  connection
});

module.exports = jobQueue;
