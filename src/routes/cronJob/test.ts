import cron from 'node-cron';
import Logger from '../../core/Logger';
import { CronExpression } from '../../core/cronUtils';

// Define your cron job schedule.
const cronSchedule = CronExpression.EVERY_10_SECONDS; // Runs every minute.

// Define the task that the cron job will execute.
const cronTask = () => {
  // Perform the task you want to run on schedule.
  Logger.info('Cron job executed at: ', new Date().toISOString());
};

// Create and start the cron job.
const cronJob = cron.schedule(cronSchedule, cronTask);

// Optionally, you can handle errors if the cron job encounters any issues.
cronJob.on('error', (error: any) => {
  Logger.error('Cron job error:', error);
});
// You can stop the cron job when needed (e.g., when your server shuts down).
// To stop the cron job, call cronJob.stop().
// cronJob.stop();
