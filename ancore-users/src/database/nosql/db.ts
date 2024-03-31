import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const { MONGO_URI, MONGO_NAME } = process.env;

const uri = `mongodb://${MONGO_URI}/${MONGO_NAME}`;

const mongodb = async () => {
  try {
    await mongoose.connect(uri);
  
    mongoose.connection.on('connected', () => {
      console.log('Connected to the database');
    });
  
    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err}`);
      process.exit(1);
    });
  
    mongoose.connection.on('disconnected', () => {
      console.log('Disconnected from the database');
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error('Validation error:', error.message);
    } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
      console.error('Document not found error:', error.message);
    } else {
      console.error('Error connecting to the database:', error);
    }
    throw error;
  }
};
  
export default mongodb;