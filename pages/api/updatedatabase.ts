/**
 * API endpoint for updating the Pinecone vector database with document embeddings.
 * This file handles the processing of documents and their upload to the vector database.
 */

import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf';
import {Pinecone} from '@pinecone-database/pinecone';
import {DirectoryLoader} from 'langchain/document_loaders/fs/directory';
import {TextLoader} from 'langchain/document_loaders/fs/text';
import {NextApiRequest, NextApiResponse} from 'next';

import {updateVectorDB} from '@/lib/utils';

/**
 * API route handler for database updates
 * @param req - NextJS API request object containing indexname and namespace
 * @param res - NextJS API response object for sending back progress updates
 */
const updateDatabase = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const {indexname, namespace} = JSON.parse(req.body);
    await handleUpload(indexname, namespace, res);
  }
};

/**
 * Handles the document upload process to Pinecone
 * @param indexname - Name of the Pinecone index to upload to
 * @param namespace - Namespace within the index for organizing vectors
 * @param res - Response object for streaming progress updates
 */
async function handleUpload(indexname: string, namespace: string, res: NextApiResponse) {
  // Configure document loader with supported file types
  const loader = new DirectoryLoader('./documents', {
    '.pdf': (path: string) => new PDFLoader(path, {splitPages: false}),
    '.txt': (path: string) => new TextLoader(path)
  });

  const docs = await loader.load();

  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
  });

  try {
    // Call updateVectorDB to process and upload documents to Pinecone
    // Parameters:
    // - client: Pinecone client instance
    // - indexname: Target index in Pinecone
    // - namespace: Namespace within the index
    // - docs: Array of processed documents
    // - callback: Progress tracking function
    await updateVectorDB(client, indexname, namespace, docs, (filename: string, totalChunks: number, chunksUpserted: number, isComplete: boolean) => {
      // Log progress to server console for monitoring
      console.log(`${filename}-${totalChunks}-${chunksUpserted}-${isComplete}`);

      if (!isComplete) {
        // Send progress update to client while upload is ongoing
        // This includes:
        // - filename: Current file being processed
        // - totalChunks: Total number of chunks for the current file
        // - chunksUpserted: Number of chunks successfully uploaded
        // - isComplete: Upload completion status
        res.write(
          JSON.stringify({
            filename,
            totalChunks,
            chunksUpserted,
            isComplete
          })
        );
      } else {
        // Close the SSE connection when upload is complete
        res.end();
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export default updateDatabase;
