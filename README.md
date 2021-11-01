# XChange Socail App


### Summary

Application made for a college course. It simulates a fictional marketplace social app where users can publish products with photos, leave comments, make groups, leave comments and reviews, and more

It's a bit rough around the edges since there were many technologies being learned when I made this app with another group.

One of the most interesting things about it is the connection to AWS to store the images. I want to use this feature elsewhere, so I wanna document how I made that work

It also uses JWT, has a mailer service, uses Redis for reactivity, and several features. The design is a bit ugly, but it does the job.

I'll leave the .envrc file uploaded since this is for educational purpouses and I already stopped using that AWS S3 bucket.

To make the app work locally, on PostgreSQL:

#### Create development database


```sh
createdb iic2513template_dev
```

#### Migrate the database

```sh
./node_modules/.bin/sequelize db:migrate
```


#### Install dependencies


```sh
yarn install
```
#### Start


```sh
yarn start
```


I plan to dockerize it when I have the time and maybe even make a video about it since I don't think it's a very covered topic for some very useful functionalities