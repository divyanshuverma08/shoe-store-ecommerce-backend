const router = require("express").Router();
const express = require('express');
const orderService = require("../../service/orderService");
const environment = require("../../utils/environment");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const endpointSecret = environment.STRIPE_ENDPOINT_SECRET;

router.post('/webhook',express.raw({type: 'application/json'}),async (request, response) => {
    const payload = request.body;
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        const orderId = checkoutSessionCompleted.metadata.order_id;
        if(checkoutSessionCompleted.payment_status === "paid"){
            try{
                await orderService.updateOrderPaymentStatus(orderId,{paymentStatus: "Complete"});
            }catch(err){
                response.status(500).send({message:"Internal Server Error"})
                return;
            }
        }
        break;
      // ... handle other event types
      default:
        // console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });
  

module.exports = router;