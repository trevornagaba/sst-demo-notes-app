// The code below achieves the following:
// 1. Make our Lambda function async, and simply return the results.
// 2. Simplify how we make calls to DynamoDB. We don’t want to have to create a new AWS.DynamoDB.DocumentClient().
// 3. Centrally handle any errors in our Lambda functions.
// 4. Finally, since all of our Lambda functions will be handling API endpoints, we want to handle our HTTP responses in one place.

import * as uuid from "uuid";
import { Table } from "sst/node/table";
import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamodb";

export const main = handler(async (event) => {
  let data = {
    content: "",
    attachment: "",
  };

  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  const params = {
    TableName: Table.Notes.tableName,
    Item: {
      // The attributes of the item to be created
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,// The id of the author
      noteId: uuid.v1(), // A unique uuid
      content: data.content, // Parsed from request body
      attachment: data.attachment, // Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return JSON.stringify(params.Item);
});