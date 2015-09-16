# Example application using Uber API
Objective: 

Build a chrome extension for yelp, using which one can request Uber. The extension pops open a uber button which gives a rough estimate of how long it would take for Uber to arrive at the user's location. Clicking the pop-up button allows user to login and grant access for the application and then proceed to display Uber product. User can then click the button and request a ride (sandbox request).

Refer to Uber API Example write up for step by step execution and screenshots.

To make this work:
1. Go to developer.uber.com and sign up for uber developer account
2. Create a uber application, specify Redirect URL and Origin URI and save application.
3. Download YelpUberExtensionGitHub.zip and extract files.
4. Edit popup.js and add Client_Id, Server Token and Redirect_Uri from your application.
5. Edit js/uber.js and add Client_Id, Server Token, Client_Secret and Redirect_Uri from your application.
5. Add Chrome extension, go to yelp.com and look up a restaurant or any place with an address.
6. Click on "green marker" in the address bar and you will see Uber button pop-up.
7. Click Uber button and login and allow access
8. The browser will now load the page from your Redirect_Uri and Uber button will display a Uber product like UberX
9. Click the button to request a ride, from sandbox and see button display the status of the request.

For more endpoints go to https://developer.uber.com/v1/endpoints

