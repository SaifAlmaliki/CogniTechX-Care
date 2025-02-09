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

export async function POST(req: Request) {
  try {
    const { base64 } = await req.json();
    if (!base64) {
      return new Response('Missing report file data', { status: 400 });
    }

    const filePart = fileToGenerativePart(base64);
    console.log('filePart:', filePart);

    const generatedContent = await model.generateContent([prompt, filePart]);
    console.log('generatedContent:', generatedContent);

    const candidate = generatedContent.response.candidates && generatedContent.response.candidates[0];
    if (!candidate) {
      return new Response('No candidate response from AI', { status: 500 });
    }

    const textResponse = candidate.content.parts[0].text;
    return new Response(textResponse, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error processing the report', { status: 500 });
  }
}

function fileToGenerativePart(imageData: string) {
  return {
    inlineData: {
      data: imageData.split(',')[1],
      mimeType: imageData.substring(imageData.indexOf(':') + 1, imageData.lastIndexOf(';'))
    }
  };
}
