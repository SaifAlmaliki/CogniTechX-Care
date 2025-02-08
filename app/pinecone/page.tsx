/**
 * VectorDBPage: A React component for updating a vector database.
 *
 * This component allows users to refresh the list of files, input an index name and namespace,
 * and upload new documents to the vector database.
 */

'use client';
import {Database, LucideLoader2, MoveUp, RefreshCcw} from 'lucide-react';
import React, {useState} from 'react';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Progress} from '@/components/ui/progress';
import {Textarea} from '@/components/ui/textarea';

// Define the props for the VectorDBPage component
type Props = {};

// Define the VectorDBPage component
const VectorDBPage = (props: Props) => {
  // Define state variables for the component
  const [isUploading, setIsUploading] = useState(false);
  const [indexname, setIndexname] = useState('');
  const [namespace, setNamespace] = useState('');
  const [fileListAsText, setFileListAsText] = useState('');
  const [filename, setFilename] = useState('');
  const [progress, setProgress] = useState(0);

  // Define a function to refresh the list of files
  const onFileListRefresh = async () => {
    // Clear the current file list
    setFileListAsText('');

    // Fetch the list of files from the server
    const response = await fetch('api/getfilelist', {method: 'GET'});
    const filenames = await response.json();

    // Log the received filenames
    console.log(filenames);

    // Create a string representation of the file list
    const resultString = (filenames as []).map(filename => `📄 ${filename}`).join('\n');

    // Update the file list state
    setFileListAsText(resultString);
  };

  // Define a function to start the upload process
  const onStartUpload = async () => {
    // Reset the progress and filename
    setProgress(0);
    setFilename('');

    // Set the uploading state to true
    setIsUploading(true);

    // Fetch the update database endpoint with the index name and namespace
    const response = await fetch('api/updatedatabase', {
      method: 'POST',
      body: JSON.stringify({
        indexname,
        namespace
      })
    });

    // Log the response
    console.log(response);

    // Process the streamed progress of the upload
    await processStreamedProgress(response);
  };

  // Define a function to process the streamed progress of the upload
  async function processStreamedProgress(response: Response) {
    // Get the reader for the response body
    const reader = response.body?.getReader();

    // Check if the reader is available
    if (!reader) {
      console.error('Reader was not found');
      return;
    }

    try {
      // Read the response body in chunks
      while (true) {
        const {done, value} = await reader.read();

        // Check if the end of the response body has been reached
        if (done) {
          // Set the uploading state to false
          setIsUploading(false);
          break;
        }

        // Decode the chunk as text
        const data = new TextDecoder().decode(value);

        // Log the received data
        console.log(data);

        // Parse the data as JSON
        const {filename, totalChunks, chunksUpserted} = JSON.parse(data);

        // Calculate the current progress
        const currentProgress = (chunksUpserted / totalChunks) * 100;

        // Update the progress and filename states
        setProgress(currentProgress);
        setFilename(`${filename} [${chunksUpserted}/${totalChunks}]`);
      }
    } catch (error) {
      // Log any errors that occur during reading
      console.error('Error reading response: ', error);
    } finally {
      // Release the reader lock
      reader.releaseLock();
    }
  }

  // Return the JSX for the component
  return (
    <main className="flex flex-col items-center p-24">
      <Card>
        <CardHeader>
          <CardTitle>Update Knowledge Base</CardTitle>
          <CardDescription>Add new documents to your vector DB</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 grid gap-4 rounded-lg border p-6">
              <div className="relative gap-4">
                <Button onClick={onFileListRefresh} className="absolute -right-4 -top-4" variant={'ghost'} size={'icon'}>
                  <RefreshCcw />
                </Button>
                <Label>Files List:</Label>
                <Textarea readOnly value={fileListAsText} className="text-muted-foreground min-h-24 resize-none border p-3 text-sm shadow-none focus-visible:ring-0 disabled:cursor-default" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Index Name</Label>
                  <Input value={indexname} onChange={e => setIndexname(e.target.value)} placeholder="index name" disabled={isUploading} className="disabled:cursor-default" />
                </div>
                <div className="grid gap-2">
                  <Label>Namespace</Label>
                  <Input value={namespace} onChange={e => setNamespace(e.target.value)} placeholder="namespace" disabled={isUploading} className="disabled:cursor-default" />
                </div>
              </div>
            </div>
            <Button onClick={onStartUpload} variant={'outline'} className="size-full" disabled={isUploading}>
              <span className="flex flex-row">
                <Database size={50} className="stroke-[#D90013]" />
                <MoveUp className="stroke-[#D90013]" />
              </span>
            </Button>
          </div>
          {isUploading && (
            <div className="mt-4">
              <Label>File Name: {filename}</Label>
              <div className="flex flex-row items-center gap-4">
                <Progress value={progress} />
                <LucideLoader2 className="animate-spin stroke-[#D90013]" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

// Export the VectorDBPage component as the default export
export default VectorDBPage;
