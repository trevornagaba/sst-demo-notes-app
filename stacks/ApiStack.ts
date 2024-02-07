// We are doing a couple of things of note here.
// 1. We are creating a new stack for our API. We could’ve used the stack we had previously 
//    created for DynamoDB and S3. But this is a good way to talk about how to share resources between stacks.
// 2. This new ApiStack references the table resource from the StorageStack that we created previously.
// 3. We are creating an API using SST’s Api construct.
// 4. We are binding our DynamoDB table to our API using the bind prop. 
//    This will allow our API to access our table.
// 5. The first route we are adding to our API is the POST /notes route. It’ll be used to create a note.
// 6. Finally, we are printing out the URL of our API as an output by calling stack.addOutputs. 
//    We are also exposing the API publicly so we can refer to it in other stacks.

import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {
  const { table } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      // Uncomment only if you want to use CORS
      // cors: true,
      function: {
        bind: [table],
      },
    },
    routes: {
      "POST /notes": "packages/functions/src/create.main",
      "GET /notes/{id}": "packages/functions/src/get.main",
      "GET /notes": "packages/functions/src/list.main",
      "PUT /notes/{id}": "packages/functions/src/update.main",
      "DELETE /notes/{id}": "packages/functions/src/delete.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // Return the API resource
  return {
    api,
  };
}