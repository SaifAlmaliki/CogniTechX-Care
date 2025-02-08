'use client';

// File Overview:
// The FileUploader component allows users to upload files via drag-and-drop or by clicking to select files.
// It displays the uploaded image or an upload icon when no files are uploaded.

// Variables:
// - files: An array of File objects or undefined, representing the files uploaded by the user.
// - onChange: A callback function that takes an array of File objects as an argument, used to handle file changes.

import Image from 'next/image';
import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

import {convertFileToUrl} from '@/utils';

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

export const FileUploader = ({files, onChange}: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, []);

  const {getRootProps, getInputProps} = useDropzone({onDrop});

  // getRootProps is a function provided by the useDropzone hook.
  // It returns the props that need to be applied to the root dropzone element,
  // allowing it to handle drag-and-drop events and manage the dropzone state.
  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image src={convertFileToUrl(files[0])} width={1000} height={1000} alt="uploaded image" className="max-h-[400px] overflow-hidden object-cover" />
      ) : (
        <>
          <Image src="/assets/icons/upload.svg" width={40} height={40} alt="upload" />
          <div className="file-upload_label">
            <p className="text-14-regular ">
              <span className="text-green-500">Click to upload </span>
              or drag and drop
            </p>
            <p className="text-12-regular">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </div>
        </>
      )}
    </div>
  );
};
