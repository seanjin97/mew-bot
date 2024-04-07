import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { MEWBOT_S3_BUCKET } from "../common/config";

export const s3Client = new S3Client({});

export async function getCatGifUrls(): Promise<string[]> {
  const getObjectCommand = new GetObjectCommand({
    Bucket: MEWBOT_S3_BUCKET,
    Key: "gifs.json",
  });

  const response = await s3Client.send(getObjectCommand);
  return JSON.parse(await response.Body!.transformToString());
}
