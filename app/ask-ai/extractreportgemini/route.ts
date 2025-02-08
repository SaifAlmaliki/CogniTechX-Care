import {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    }
  ]
});

const prompt = `You are analyzing an image of a clinical report.

1. Identify biomarkers that show slight or significant abnormalities.
2. Extract numerical values, key details, and the report title.
3. Summarize findings concisely (100 words max). If the report has multiple pages, increase the word limit accordingly.
4. Exclude patient-identifiable information (name, date, etc.).
5. Based on the abnormalities, provide:
   - **Precautions**: Key steps the patient should take to manage or monitor the condition.
   - **Potential Treatments**: Common medical interventions or lifestyle changes that may help.

## Summary:
## Precautions:
## Potential Treatments:
`;

export async function POST(req: Request, res: Response) {
  const {base64} = await req.json();
  const filePart = fileToGenerativePart(base64);

  console.log(filePart);
  const generatedContent = await model.generateContent([prompt, filePart]);

  console.log(generatedContent);
  const textResponse = generatedContent.response.candidates![0].content.parts[0].text;
  return new Response(textResponse, {status: 200});
}

function fileToGenerativePart(imageData: string) {
  return {
    inlineData: {
      data: imageData.split(',')[1],
      mimeType: imageData.substring(imageData.indexOf(':') + 1, imageData.lastIndexOf(';'))
    }
  };
}
