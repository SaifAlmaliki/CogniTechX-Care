// patient.actions.ts
// This file contains actions related to user and patient management, including creating, retrieving, and registering patient records.
// It interacts with the Appwrite backend to perform these operations.

// Summary:
// This file provides functions to manage patients, including creating a new user or retrieving an existing one,
// registering a new patient, and retrieving a patient by user ID.

'use server';

import {ID, InputFile, Query} from 'node-appwrite';

import {BUCKET_ID, DATABASE_ID, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, databases, storage, users} from '../appwrite.config';
import {parseStringify} from '../../utils';

// CREATE APPWRITE USER
// Function to create a new user or retrieve an existing one
export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name);

    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal('email', [user.email]) // Filter users by email
      ]);

      return existingUser.users[0];
    }
    console.error('An error occurred while creating a new user:', error);
  }
};

// GET USER
// Function to retrieve a user by ID
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId); // Retrieve user by ID

    return parseStringify(user);
  } catch (error) {
    console.error('An error occurred while retrieving the user details:', error);
  }
};

// REGISTER PATIENT
// Function to register a new patient
export const registerPatient = async ({identificationDocument, ...patient}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile = identificationDocument && InputFile.fromBlob(identificationDocument?.get('blobFile') as Blob, identificationDocument?.get('fileName') as string);

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile); // Upload file to storage
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(), // Use a unique ID for the document
      {
        identificationDocumentId: file?.$id ? file.$id : null, // Store file ID
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}` // Generate file URL
          : null,
        ...patient
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error('An error occurred while creating a new patient:', error);
  }
};

// GET PATIENT
// Function to retrieve a patient by user ID
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal('userId', [userId])] // Filter patients by user ID
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error('An error occurred while retrieving the patient details:', error);
  }
};
