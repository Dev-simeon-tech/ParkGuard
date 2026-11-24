export function getConfidenceLevel(confidence: number) {
  if (confidence >= 0.8) {
    return 'High';
  } else if (confidence >= 0.5) {
    return 'Medium';
  } else {
    return 'Low';
  }
}
