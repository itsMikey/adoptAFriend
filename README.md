# adoptAFriend
Alexa skill that reads to you adoptable pets in your areas or local shelters. The idea is that these animals might have a better chance of being adopted not by their looks but their story.

### How to run
To run tests `yarn run test`  
To build `yarn run build`    
You'll also need to throw in a env.yml in the config folder with this setup:   
app:  
&nbsp; alexa:  
&nbsp;&nbsp; appId:  
  petFinder:  
    &nbsp; apiKey:  
    &nbsp; apiSecret:   
    &nbsp; url:  
    

### Stack
Serverless
Typescript
Node.js
AWS Lambda
