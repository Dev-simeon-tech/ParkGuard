export const SessionMessages = {
  BRANCH_NOT_ASSIGNED: 'You are not assigned to this branch',
  SESSION_NOT_FOUND: 'Parking session not found',
  SESSION_ALREADY_CLOSED: 'This session has already been closed',
  VEHICLE_NOT_FOUND: 'Vehicle not found',
  PHOTO_NOT_FOUND: 'Photo not found',
  INVALID_PHOTO_REFERENCE: 'Invalid photo reference',
  ACTIVE_SESSION_EXISTS: 'This vehicle already has an active session',
  IMAGE_REQUIRED: 'An image is required',
  IMAGE_INVALID: 'Image must be a valid base64 encoded JPEG or PNG',
  IMAGE_TOO_LARGE: 'Image must be 10MB or smaller',
} as const;
