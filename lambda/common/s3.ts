import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { MEWBOT_S3_BUCKET } from "./config";
import * as _ from "lodash";

export const s3Client = new S3Client({});

export async function getCatGifUrls(): Promise<string[]> {
  const ranNum = _.random(0, 44);
  const getObjectCommand = new GetObjectCommand({
    Bucket: MEWBOT_S3_BUCKET,
    Key: `chunk_${ranNum}.json`,
  });

  const response = await s3Client.send(getObjectCommand);
  return JSON.parse(await response.Body!.transformToString());
}
