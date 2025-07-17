const cron = require('node-cron');
const fetchJobs = require('../jobs/fetchJobs');

cron.schedule('0 * * * *', async () => {
  console.log('Cron running fetchJobs...');
  await fetchJobs();
});
