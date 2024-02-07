// 1. We are creating a handler function that we’ll use as a wrapper around our Lambda functions.
// 2. It takes our Lambda function as the argument.
// 3. We then run the Lambda function in a try/catch block.
// 4. On success, we take the result and return it with a 200 status code.
// 5. If there is an error then we return the error message with a 500 status code.

import { Context, APIGatewayProxyEvent } from "aws-lambda";

export default function handler(
  lambda: (evt: APIGatewayProxyEvent, context: Context) => Promise<string>
) {
  return async function (event: APIGatewayProxyEvent, context: Context) {
    let body, statusCode;

    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = 200;
    } catch (error) {
      statusCode = 500;
      body = JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Return HTTP response
    return {
      body,
      statusCode,
    };
  };
}