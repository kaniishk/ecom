import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/sugandham',
  JWT_SECRET: process.env.JWT_SECRET || 'somethingsecret',
  accessKeyId: 'AKIAJ2XHDMWUEIRGBZEA',
  secretAccessKey: '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',
};
