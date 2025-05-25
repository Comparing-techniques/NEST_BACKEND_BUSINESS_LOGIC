import { VideoRecording } from 'src/entities';

export const videoRecordingEntitieToVideoRecordingResponseDto = (
  videoRecording: VideoRecording,
  fileurl: string,
) => {
  return {
    id: videoRecording.id,
    filename: videoRecording.filename,
    fileurl,
    status: videoRecording.status,
  };
};
