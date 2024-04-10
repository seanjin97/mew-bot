import { aws_cloudfront_origins, Stack, StackProps } from "aws-cdk-lib";
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
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";

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
        SECRET_CHAT_ID: config.SECRET_CHAT_ID,
        SECRET_MESSAGE: config.SECRET_MESSAGE,
        CLOUDFRONT_DOMAIN: config.CLOUDFRONT_DOMAIN,
      },
      timeout: cdk.Duration.seconds(3),
      bundling: {
        format: OutputFormat.ESM,
      },
    });

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
        SECRET_CHAT_ID: config.SECRET_CHAT_ID,
        CLOUDFRONT_DOMAIN: config.CLOUDFRONT_DOMAIN,
      },
      timeout: cdk.Duration.seconds(3),
      bundling: {
        format: OutputFormat.ESM,
      },
    });

    const rule = new events.Rule(this, "pokeRule", {
      schedule: events.Schedule.expression("rate(2 hours)"),
    });

    rule.addTarget(new targets.LambdaFunction(poke));

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "mewOriginAccessIdentity",
    );
    mewBotCacheBucket.grantRead(originAccessIdentity);

    new cloudfront.Distribution(this, "mewCloudfrontDistribution", {
      defaultBehavior: {
        origin: new aws_cloudfront_origins.S3Origin(mewBotCacheBucket, {
          originAccessIdentity: originAccessIdentity,
        }),
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
    });
  }
}
