// lib/appwrite.config.ts
// This file contains the configuration settings for connecting to the Appwrite backend service.
// It includes project ID, API keys, and database IDs necessary for API interactions.
// Summary: This configuration file initializes the Appwrite client and services for API interactions.

import * as sdk from "node-appwrite";

// Extract environment variables for Appwrite configuration
export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

// Initialize the Appwrite client
const client = new sdk.Client()
  // Set Appwrite API Endpoint from environment variable
  .setEndpoint(ENDPOINT!)
  // Set Appwrite Project ID from environment variable
  .setProject(PROJECT_ID!)
  // Set Appwrite API Key from environment variable
  .setKey(API_KEY!);

// Initialize Appwrite services
export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
