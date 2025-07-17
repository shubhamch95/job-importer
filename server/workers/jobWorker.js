const { Worker } = require('bullmq');
const Redis = require('ioredis');
const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('../models/Job');
const ImportLog = require('../models/ImportLog');
const connectDB = require('../config/db');

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null
});

connectDB();

const statsMap = new Map();

const concurrency = parseInt(process.env.QUEUE_CONCURRENCY) || 5;

const worker = new Worker('job-importer-queue', async (job) => {
  const data = job.data;
  const source = data.source;

  if (!statsMap.has(source)) {
    statsMap.set(source, { newJobs: 0, updatedJobs: 0, failedJobs: [] });
  }

  const stats = statsMap.get(source);

  if (data.jobId && typeof data.jobId === 'object' && data.jobId._) {
    data.jobId = data.jobId._;
  }

  try {
    const existing = await Job.findOne({ jobId: data.jobId });

    if (existing) {
      await Job.updateOne({ jobId: data.jobId }, data);
      stats.updatedJobs++;
    } else {
      await Job.create(data);
      stats.newJobs++;
    }

  } catch (err) {
    stats.failedJobs.push({ jobId: String(data.jobId), reason: err.message });
  }
}, { connection, concurrency });

worker.on('drained', async () => {
  for (let [sourceUrl, stats] of statsMap.entries()) {
    const logEntry = new ImportLog({
      timestamp: new Date(),
      sourceUrl,
      totalFetched: stats.newJobs + stats.updatedJobs + stats.failedJobs.length,
      totalImported: stats.newJobs + stats.updatedJobs,
      newJobs: stats.newJobs,
      updatedJobs: stats.updatedJobs,
      failedJobs: stats.failedJobs
    });

    await logEntry.save();
    console.log(`Import log saved for ${sourceUrl}`);
  }

  statsMap.clear();
});

worker.on('error', err => {
  console.error('Worker error:', err);
});
