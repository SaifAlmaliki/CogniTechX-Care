import {Document as LangChainDocument} from '@langchain/core/documents';
import {Pinecone, PineconeRecord, RecordMetadata} from '@pinecone-database/pinecone';
import {FeatureExtractionPipeline, pipeline} from '@xenova/transformers';
import {type ClassValue, clsx} from 'clsx';
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter';
import {twMerge} from 'tailwind-merge';

import {batchsize} from './config';

/**
 * Utility function to combine CSS class names
 * @param inputs - Array of class values to be combined
 * @returns A merged string of class names with Tailwind conflicts resolved
 *
 * This function uses clsx to merge class names and tailwind-merge to handle
 * Tailwind CSS class conflicts properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a deep copy of any JavaScript value
 * @param value - Any JavaScript value to be deep copied
 * @returns A new deep copy of the input value
 *
 * This function uses JSON parse/stringify to create a true deep copy,
 * breaking all references to the original object
 */
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

/**
 * Converts a File object to a URL for preview/display
 * @param file - File object to be converted
 * @returns A blob URL representing the file
 *
 * Creates a URL that can be used to display/preview the file in the browser
 * Note: Remember to revoke the URL when no longer needed to free up memory
 */
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

/**
 * Comprehensive date and time formatter with timezone support
 * @param dateString - Date string or Date object to format
 * @param timeZone - Optional timezone (defaults to local timezone)
 * @returns Object containing various formatted date/time strings
 *
 * Returns an object with four different format options:
 * - dateTime: Full date and time (e.g., "Oct 25, 2023, 8:30 AM")
 * - dateDay: Date with weekday (e.g., "Mon, 10/25/2023")
 * - dateOnly: Date without time (e.g., "Oct 25, 2023")
 * - timeOnly: Time only (e.g., "8:30 AM")
 */
export const formatDateTime = (dateString: Date | string, timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone) => {
  // Define options for full date-time format
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    // weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    year: 'numeric', // numeric year (e.g., '2023')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false),
    timeZone // use the provided timezone
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    year: 'numeric', // numeric year (e.g., '2023')
    month: '2-digit', // abbreviated month name (e.g., 'Oct')
    day: '2-digit', // numeric day of the month (e.g., '25')
    timeZone // use the provided timezone
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
    timeZone // use the provided timezone
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    timeZone // use the provided timezone
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString('en-US', dateTimeOptions);
  const formattedDateDay: string = new Date(dateString).toLocaleString('en-US', dateDayOptions);
  const formattedDate: string = new Date(dateString).toLocaleString('en-US', dateOptions);
  const formattedTime: string = new Date(dateString).toLocaleString('en-US', timeOptions);

  // Return all formatted strings in an object
  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime
  };
};

/**
 * Simple encryption using base64 encoding
 * @param passkey - String to be encrypted
 * @returns Base64 encoded string
 *
 * Note: This is not secure encryption, only basic encoding.
 * Use proper encryption methods for sensitive data.
 */
export function encryptKey(passkey: string) {
  return btoa(passkey);
}

/**
 * Simple decryption using base64 decoding
 * @param passkey - Base64 encoded string to be decrypted
 * @returns Decoded string
 *
 * Note: This is not secure decryption, only basic decoding.
 * Use proper decryption methods for sensitive data.
 */
export function decryptKey(passkey: string) {
  return atob(passkey);
}

// Global variables for tracking document processing progress
let callback: (filename: string, totalChunks: number, chunksUpserted: number, isComplete: boolean) => void;
let totalDocumentChunks: number;
let totalDocumentChunksUpseted: number;

/**
 * Updates the vector database with document embeddings
 * @param client - Pinecone client instance
 * @param indexname - Name of the Pinecone index
 * @param namespace - Namespace within the index
 * @param docs - Array of documents to process
 * @param progressCallback - Callback function to report progress
 *
 * This function processes multiple documents, creates embeddings,
 * and stores them in the Pinecone vector database
 */
export async function updateVectorDB(client: Pinecone, indexname: string, namespace: string, docs: LangChainDocument[], progressCallback: (filename: string, totalChunks: number, chunksUpserted: number, isComplete: boolean) => void) {
  // Initialize progress tracking
  callback = progressCallback;
  totalDocumentChunks = 0;
  totalDocumentChunksUpseted = 0;

  // Initialize the feature extraction model
  const modelname = 'mixedbread-ai/mxbai-embed-large-v1';
  const extractor = await pipeline('feature-extraction', modelname, {
    quantized: false
  });

  // Process each document
  for (const doc of docs) {
    await processDocument(client, indexname, namespace, doc, extractor);
  }

  // Call the callback one final time with completion status
  if (callback !== undefined) {
    const lastDoc = docs[docs.length - 1];
    const lastFilename = getFilename(lastDoc.metadata.source);
    callback(lastFilename, totalDocumentChunks, totalDocumentChunksUpseted, true);
  }
}

/**
 * Processes a single document for vector database storage
 * @param client - Pinecone client instance
 * @param indexname - Name of the Pinecone index
 * @param namespace - Namespace within the index
 * @param doc - Document to process
 * @param extractor - Feature extraction pipeline
 *
 * Splits the document into chunks and processes them in batches
 */
async function processDocument(client: Pinecone, indexname: string, namespace: string, doc: LangChainDocument, extractor: FeatureExtractionPipeline) {
  // Split document into manageable chunks
  const splitter = new RecursiveCharacterTextSplitter();
  const documentChunks = await splitter.splitText(doc.pageContent);

  // Initialize progress tracking for this document
  totalDocumentChunks = documentChunks.length;
  totalDocumentChunksUpseted = 0;
  const filename = getFilename(doc.metadata.source);

  // Process chunks in batches
  let chunkBatchIndex = 0;
  while (documentChunks.length > 0) {
    chunkBatchIndex++;
    const chunkBatch = documentChunks.splice(0, batchsize);
    await processOneBatch(client, indexname, namespace, extractor, chunkBatch, chunkBatchIndex, filename);
  }
}

/**
 * Extracts filename from a full path
 * @param filename - Full path including filename
 * @returns Filename without extension
 *
 * Removes path and extension from the full filename
 */
function getFilename(filename: string): string {
  const docname = filename.substring(filename.lastIndexOf('/') + 1);
  return docname.substring(0, docname.lastIndexOf('.')) || docname;
}

/**
 * Processes a batch of document chunks
 * @param client - Pinecone client instance
 * @param indexname - Name of the Pinecone index
 * @param namespace - Namespace within the index
 * @param extractor - Feature extraction pipeline
 * @param chunkBatch - Array of text chunks to process
 * @param chunkBatchIndex - Current batch index
 * @param filename - Name of the file being processed
 *
 * Creates embeddings for each chunk and uploads them to Pinecone
 */
async function processOneBatch(client: Pinecone, indexname: string, namespace: string, extractor: FeatureExtractionPipeline, chunkBatch: string[], chunkBatchIndex: number, filename: string) {
  // Generate embeddings for the batch
  const output = await extractor(
    chunkBatch.map(str => str.replace(/\n/g, ' ')), // Remove newlines for better processing
    {
      pooling: 'cls' // Use CLS token pooling strategy
    }
  );
  const embeddingsBatch = output.tolist();

  // Create vector records for each chunk
  let vectorBatch: PineconeRecord<RecordMetadata>[] = [];
  for (let i = 0; i < chunkBatch.length; i++) {
    const chunk = chunkBatch[i];
    const embedding = embeddingsBatch[i];

    const vector: PineconeRecord<RecordMetadata> = {
      id: `${filename}-${chunkBatchIndex}-${i}`, // Create unique ID for each vector
      values: embedding,
      metadata: {
        chunk // Store original text in metadata
      }
    };
    vectorBatch.push(vector);
  }

  // Upload vectors to Pinecone
  const index = client.Index(indexname).namespace(namespace);
  await index.upsert(vectorBatch);

  // Update progress
  totalDocumentChunksUpseted += vectorBatch.length;
  if (callback !== undefined) {
    callback(filename, totalDocumentChunks, totalDocumentChunksUpseted, false);
  }

  // Clear the batch array
  vectorBatch = [];
}
