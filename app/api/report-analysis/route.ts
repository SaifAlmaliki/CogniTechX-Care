// This is the initial setup for the report analysis API endpoint.
// It will handle the processing of uploaded medical reports.

import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { reportContent } = req.body;

      // Call OpenAI API to analyze the report
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo",
        prompt: `Analyze the following medical report and provide a clear summary: ${reportContent}`,
        max_tokens: 150,
      });

      const analysisResult = response.choices[0].text;

      res.status(200).json({ analysis: analysisResult });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze the report" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
