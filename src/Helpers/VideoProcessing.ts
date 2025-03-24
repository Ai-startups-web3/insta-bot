import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

// Define types for function parameters
type CropVideoParams = {
  inputVideo: string;
  outputDir: string;
  beepAudio?: string;
  videoNumber: number;
  videoDuration: number;
  episode: number;
};

// Function to crop video into segments
export const cropVideo = async (
  inputVideo: string,
  outputDir: string,
  beepAudio: string,
  videoNumber: number,
  videoDuration: number,
  episode: number,
): Promise<void> => {
  const startTime = videoNumber * videoDuration;

  console.log("startTime", startTime);
  
  // Get the total duration of the input video
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputVideo, (err, metadata) => {
      if (err) {
        console.error('Error getting video metadata:', err);
        reject(err);
        return;
      }

      const durationInSeconds = metadata.format.duration;
      
      // Ensure the crop does not exceed video length
      if (durationInSeconds && startTime >= durationInSeconds) {
        console.error('Total crop time exceeds video duration.');
        reject('Total crop time exceeds video duration.');
        return;
      }

      createSegment(startTime, inputVideo, outputDir, beepAudio, videoNumber, videoDuration, episode)
        .then(() => {
          console.log('Video segment created.');
          resolve();
        })
        .catch((err) => {
          console.error('Error during video cropping:', err);
          reject(err);
        });
    });
  });
};

// Function to create a video segment
const createSegment = (
  startTime: number,
  inputVideo: string,
  outputDir: string,
  beepAudio: string,
  videoNumber: number,
  videoDuration: number,
  episode: number
): Promise<void> => {
  const segmentEndTime = startTime + videoDuration;
  const outputFilename = path.join(outputDir, `${videoNumber}.mp4`);
  const previousFilename = path.join(outputDir, `${videoNumber - 1}.mp4`);

  const text = `Ep ${episode} Part ${videoNumber}`;

  return new Promise((resolve, reject) => {
    const command = ffmpeg(inputVideo)
      .inputOptions(['-ss', startTime.toString(), '-t', videoDuration.toString()])
      .format('mp4')
      
      .outputOptions([
        '-movflags', 'faststart',
        '-pix_fmt', 'yuv420p',
        '-r', '30',
        `-vf`, `drawtext=text='${text}':fontcolor=white:fontsize=80:box=1:boxcolor=black@0.5:x=(w-text_w)/2:y=50`,
        '-b:v', '2000k',
        '-maxrate', '2000k',
        '-bufsize', '4000k',
        '-b:a', '64k',
      ]);

    // if (beepAudio) {
    //   command.input(beepAudio).complexFilter(['[0:a][1:a]amix=inputs=2:duration=shortest']);
    // }

    command
      .on('end', () => {
        console.log(`Segment ${videoNumber} created: ${outputFilename}`);

        // Check if the previous video exists and delete it
        if (fs.existsSync(previousFilename)) {
          fs.unlink(previousFilename, (err) => {
            if (err) {
              console.error(`Error deleting file ${previousFilename}:`, err);
            } else {
              console.log(`Deleted previous video: ${previousFilename}`);
            }
          });
        }

        resolve();
      })
      .on('error', (err: any) => {
        console.error(`Error creating segment ${videoNumber}:`, err);
        reject(err);
      })
      .save(outputFilename);
  });
};
