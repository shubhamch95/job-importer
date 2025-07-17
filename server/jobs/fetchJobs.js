const axios = require('axios');
const xml2js = require('xml2js');
const jobQueue = require('../queue/jobQueue');
require('dotenv').config();

const jobFeeds = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://jobicy.com/?feed=job_feed&job_categories=business',
  'https://jobicy.com/?feed=job_feed&job_categories=management',
  // 'https://www.higheredjobs.com/rss/articleFeed.cfm'
];

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 100;

const parseXmlToJson = async (xml, url) => {
  try {
    return await xml2js.parseStringPromise(xml, { explicitArray: false });
  } catch (e) {
    console.error(`XML parsing failed for ${url}: ${e.message}`);
    return null;
  }
};

const fetchJobsFromFeeds = async () => {
  for (let url of jobFeeds) {
    try {
      console.log(`📡 Fetching from: ${url}`);
      const response = await axios.get(url);
      const jsonData = await parseXmlToJson(response.data, url);
      if (!jsonData || !jsonData.rss?.channel?.item) {
        console.warn(`Skipped due to empty or invalid data from ${url}`);
        continue;
      }

      const items = jsonData.rss.channel.item;
      const jobsArray = Array.isArray(items) ? items : [items];

      for (let i = 0; i < jobsArray.length; i += BATCH_SIZE) {
        const batch = jobsArray.slice(i, i + BATCH_SIZE);

        for (const job of batch) {
          const jobId =
            typeof job.guid === 'object' && job.guid._ ? job.guid._ :
            typeof job.guid === 'string' ? job.guid :
            job.link || job.title;

          const jobData = {
            jobId,
            title: job.title,
            company: job['dc:creator'] || '',
            description: job.description || '',
            location: job.location || 'Remote',
            url: job.link,
            datePosted: job.pubDate ? new Date(job.pubDate) : new Date(),
            tags: job.categories || [],
            type: job.type || 'Full-time',
            source: url
          };

          await jobQueue.add('import-job', jobData, {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 5000
            }
          });

          console.log(`Queued: ${jobData.title}`);
        }
      }

    } catch (err) {
      console.error(`Failed fetching ${url}:`, err.message);
    }
  }
};

module.exports = fetchJobsFromFeeds;