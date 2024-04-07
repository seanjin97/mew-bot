import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as config from "./config";
import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";

export class MewBotStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const mewBotCacheBucket = new s3.Bucket(this, "mewbot-cache", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
    });

    const mewBot = new lambdaNodeJs.NodejsFunction(this, "meowHandler", {
      runtime: Runtime.NODEJS_20_X,
      entry: "lambda/meow/index.ts",
      environment: {
        MEW_BOT_API_TOKEN: config.MEW_BOT_API_TOKEN,
        GIPHY_API_TOKEN: config.GIPHY_API_TOKEN,
        MEWBOT_S3_BUCKET: mewBotCacheBucket.bucketName,
        SECRET_CHAT_ID: config.SECRET_CHAT_ID,
        SECRET_MESSAGE: config.SECRET_MESSAGE,
      },
      timeout: cdk.Duration.seconds(3),
    });

    mewBotCacheBucket.grantRead(mewBot);

    const httpApi = new apigwv2.HttpApi(this, "HttpApi");

    const meowIntegration = new HttpLambdaIntegration(
      "MeowIntegration",
      mewBot,
    );

    httpApi.addRoutes({
      path: "/meow",
      methods: [apigwv2.HttpMethod.POST],
      integration: meowIntegration,
    });

    const poke = new lambdaNodeJs.NodejsFunction(this, "pokeHandler", {
      runtime: Runtime.NODEJS_20_X,
      entry: "lambda/poke/index.ts",
      environment: {
        MEW_BOT_API_TOKEN: config.MEW_BOT_API_TOKEN,
        MEWBOT_S3_BUCKET: mewBotCacheBucket.bucketName,
        SECRET_CHAT_ID: config.SECRET_CHAT_ID,
      },
    });

    mewBotCacheBucket.grantRead(poke);

    const rule = new events.Rule(this, "pokeRule", {
      schedule: events.Schedule.expression("rate(2 hours)"),
    });

    rule.addTarget(new targets.LambdaFunction(poke));
  }
}
