import { InternalException } from '@/common/exceptions';
import { envConfig } from '@/config';

export type PlateRecognitionResult = {
  plateNumber: string | null;
  confidence: number | null;
};
type PredictionType = { confidence: number }[];

export type RoboflowOutput = {
  model_output: { predictions: PredictionType };
  plate_text: string[];
};
export function isRoboflowConfigured(): boolean {
  return Boolean(
    envConfig.roboflow.apiKey && envConfig.roboflow.workspace && envConfig.roboflow.workflowId,
  );
}

// Roboflow Workflow outputs are named by whoever built the workflow in the
// Roboflow UI, so the exact key(s) below are a best guess at common naming
// (e.g. an OCR block outputting `ocr_text` + `ocr_confidence`, or a plate
// detection block outputting `predictions`) — adjust once a real workflow
// exists and its actual output shape is known.
function extractPlateFromWorkflowOutput(output: RoboflowOutput): PlateRecognitionResult {
  const plateNumber = output?.plate_text[0];
  const confidence = output.model_output.predictions[0]?.confidence;
  return {
    plateNumber: plateNumber ? plateNumber.trim().toUpperCase() : null,
    confidence,
  };
}

export async function recognizePlate(imageBase64: string): Promise<PlateRecognitionResult> {
  const { apiKey, workspace, workflowId } = envConfig.roboflow;
  if (!apiKey || !workspace || !workflowId) {
    throw new InternalException('Plate recognition is not configured');
  }

  const response = await fetch(
    `https://serverless.roboflow.com/${workspace}/workflows/${workflowId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        inputs: {
          image: { type: 'base64', value: imageBase64 },
        },
      }),
    },
  );

  if (!response.ok) {
    throw new InternalException(`Roboflow request failed with status ${response.status}`);
  }

  const body = (await response.json()) as { outputs?: RoboflowOutput[] };
  const output = body.outputs?.[0];
  if (!output) {
    return { plateNumber: null, confidence: null };
  }
  return extractPlateFromWorkflowOutput(output);
}
