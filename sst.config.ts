// An SST app is made up of two parts.

// stacks/ — App Infrastructure

// The code that describes the infrastructure of your serverless app is placed in the stacks/ directory of 
// your project. SST uses AWS CDK, to create the infrastructure.

// packages/ — App Code

// The Lambda function code that’s run when your API is invoked is placed in the packages/functions 
//directory of your project. While packages/core contains our business logic.


import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { FrontendStack } from "./stacks/FrontendStack";

export default {
  config(_input) {
    return {
      name: "notes",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app
      .stack(StorageStack)
      .stack(ApiStack)
      .stack(AuthStack)
      .stack(FrontendStack);
  },
} satisfies SSTConfig;