# Server
[Creating an Express server](https://medium.com/better-programming/create-an-express-server-using-typescript-dec8a51e7f8d)

## Run & build server
`npm run dev` will build and start server concurrently. The package Nodemon should also restart the server automatically whenever we change we save any changes in the code.

## Responses
Responses can be consulted [here](http://localhost:4000)
Append any routes defined in `server/routes/index.ts` to the URL to see response associated with the route.


## Documentation
[Express](https://expressjs.com/en/4x/api.html)

### `dist` folder
Contains the JavaScript files in `src` that were transpiled from TypeScript to JavaScript.

### Routes
[Basic Routing](https://expressjs.com/en/guide/routing.html)

### commande deployer le serveur
downloader heroku

heroku login
email -> webersadler.mark@gmail.com
password -> projet3-LOG3900
heroku git:clone -a log3900-server
cd log3900-server

puis 2 options:
1: envoie message commmit de  "" (rien)
npm run deploy 
2: message commit custom
git add .
git commit -am "make it better"
git push heroku master

Pour avoir le lien internet
heroku open
