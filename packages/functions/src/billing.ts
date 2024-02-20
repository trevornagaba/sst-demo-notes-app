import Stripe from "stripe";
import { Config } from "sst/node/config";
import handler from "@notes/core/handler";
import { calculateCost } from "@notes/core/cost";

export const main = handler(async (event) => {
  // Get the storage and source from the request body. 
  // The storage variable is the number of notes the user would like to store in his account. 
  // And source is the Stripe token for the card that we are going to charge.
  const { storage, source } = JSON.parse(event.body || "{}");
  // Call function to figure out how much to charge a user based on the number of notes that are going to be stored.
  const amount = calculateCost(storage);
  const description = "Scratch charge";
  
  // We create a new Stripe object using our Stripe Secret key. 
  // We are getting this from the environment variable that we configured in pnpm sst secrets set
  // Load our secret key
  const stripe = new Stripe(Config.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  // Use the stripe.charges.create method to charge the user,
  // Respond to the request if everything went through successfully
  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "usd",
  });

  return JSON.stringify({ status: true });
});