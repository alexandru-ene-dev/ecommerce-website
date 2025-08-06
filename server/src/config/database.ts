import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const gracefulShutdown = async (signal: string) => {
  await mongoose.disconnect();
  console.log('Mongoose disconnected');
  process.exit(0);
};

if (!process.env.DB_STRING) {
  console.error('There is no connection string in the environment');
  process.exit(1);
}

const url = process.env.DB_STRING;

const run = async (): Promise<void> => {
  try {
    // connect to database
    if (url) {
      await mongoose.connect(url);
      console.log('Connected to Mongoose!');
    }
  } catch (err) {
    console.error(`Connection to database failed: ${(err as Error).message}`);
    process.exit(1);
  }
};

['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => gracefulShutdown(signal));
});

process.on('unhandledRejection', async () => {
  await mongoose.disconnect();
  console.log('Mongoose disconnected on app termination');
  process.exit(0);
});

export default run;