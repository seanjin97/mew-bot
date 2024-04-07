#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { MewBotStack } from "../lib/mew-bot-stack";

const app = new cdk.App();
new MewBotStack(app, "MewBotStack");
