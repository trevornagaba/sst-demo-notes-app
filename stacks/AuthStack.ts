// This code meets the following objectives:
// 1. We are creating a new stack for our auth infrastructure. 
//    While we don’t need to create a separate stack, we are using it as an example to show how to 
//    work with multiple stacks.
// 2. The Auth construct creates a Cognito User Pool for us. 
//    We are using the login prop to state that we want our users to login with their email.
// 3. The Auth construct also creates an Identity Pool. 
//    The attachPermissionsForAuthUsers function allows us to specify the resources our authenticated  
//    users will have access to.
// 4. This new AuthStack references the bucket resource from the StorageStack and 
//    the api resource from the ApiStack that we created previously.
// 5. And we want them to access our S3 bucket. We’ll look at this in detail below.
// 6. Finally, we output the ids of the auth resources that have been created and 
//    returning the auth resource so that other stacks can access this resource.

import { ApiStack } from "./ApiStack";
import * as iam from "aws-cdk-lib/aws-iam";
import { StorageStack } from "./StorageStack";
import { Cognito, StackContext, use } from "sst/constructs";

export function AuthStack({ stack, app }: StackContext) {
    const { api } = use(ApiStack);
    const { bucket } = use(StorageStack);

    // Create a Cognito User Pool and Identity Pool
    const auth = new Cognito(stack, "Auth", {
        login: ["email"],
    });

    auth.attachPermissionsForAuthUsers(stack, [
        // Allow access to the API
        api,
        // Policy granting access to a specific folder in the bucket
        new iam.PolicyStatement({
            actions: ["s3:*"],
            effect: iam.Effect.ALLOW,
            resources: [
                bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
            ],
        }),
    ]);
    // In the above policy we are granting our logged in users access to the path 
    // private/${cognito-identity.amazonaws.com:sub}/ within our S3 bucket’s ARN. 
    // Where cognito-identity.amazonaws.com:sub is the authenticated user’s federated identity 
    // id (their user id). So a user has access to only their folder within the bucket. 
    // This allows us to separate access to our user’s file uploads within the same S3 bucket.

    // One other thing to note is that, the federated identity id is a UUID that is assigned by our 
    // Identity Pool. This id is different from the one that a user is assigned in a User Pool. 
    // This is because you can have multiple authentication providers. 
    // The Identity Pool federates these identities and gives each user a unique id.

    // Show the auth resources in the output
    stack.addOutputs({
        Region: app.region,
        UserPoolId: auth.userPoolId,
        UserPoolClientId: auth.userPoolClientId,
        IdentityPoolId: auth.cognitoIdentityPoolId,
    });

    // Return the auth resource
    return {
        auth,
    };
}