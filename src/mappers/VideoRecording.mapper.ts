import { VideoRecording } from 'src/entities';

export const videoRecordingEntitieToVideoRecordingResponseDto = (
  videoRecording: VideoRecording,
) => {
  return {
    id: videoRecording.id,
    filename: videoRecording.filename,
    status: videoRecording.status,
  };
};
