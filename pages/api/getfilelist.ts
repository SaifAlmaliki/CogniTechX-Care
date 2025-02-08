// API endpoint for retrieving the list of files from the documents directory
import fs from 'fs';

import {NextApiRequest, NextApiResponse} from 'next';
// Handles GET requests to retrieve the list of files in the documents directory
const getFileList = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const files = fs.readdirSync('./documents');
    res.status(200).json(files);
  }
};

export default getFileList;
