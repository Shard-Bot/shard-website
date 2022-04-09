## **Shard Bot Website**

![Shard Logo](https://media.discordapp.net/attachments/942079456607105044/962363298827882536/logo.png "Shard Logo")

<br>

# Features:
-   Login Using Discord's OAuth
-   Several API Utilities  
-   Edit Shard's Bot Configuration Through A Web Interface
-   Search Result Optimization (SEO)

<br>
<br>

# Setup:
For this setup you will require the following:
-   A Discord Bot Account.
-   Latest version of Node.js.
-   Git (for cloning the repository).
-   A Browser with Javascript enabled.
-   At least 1GB of free space and memory.
-   Internet Connection.

<br>

Step 1: Clone the repository and cd into the directory.
```shell
$ git clone https://github.com/Shard-Bot/shard-website.git shard-website
$ cd ./shard-website/
```
<br>

Step 2: Install the dependencies
```shell
$ npm install --save
```
<br>

Step 3: Create the .env file, copy the next lines and paste them into the file, change the values to your own, all of them are required.

```js
PORT="Your port number"
HOST="The Base URL of the Website, example: http://localhost:3000/ (the / at the end is important)"
MONGODB_URI="The URI of your MongoDB Database"

SESSION_SECRET="A random string to encrypt the sessions"

CLIENT_ID="Your Discord Client ID"
CLIENT_SECRET="Your Discord Client Secret"

ERROR_WEBHOOK_URL="The URL of the webhook of the channel where you want the errors to be sent"
ERROR_WEBHOOK_STAFF="The user who will be pinged when an error occurs"

TOKEN="Your bot token"
```

You **Must** add the host to the authorized redirect urls on your Discord's application settings, example: http://localhost:300/api/auth/login

<br>

Step 4: Run the server.
```shell
$  npm start
```

This will automatically compile the site and start it,
If you present any issues, please contact me on Discord.

<br>
<br>

# Acknowledgements:
-   [Node.js](https://nodejs.org/): Used for the server.
-   [Express.js](https://expressjs.com/): Used for the web server.
-   [Next.js](https://nextjs.org/): Used for the front-end interface and routing.
-   [TypeScript](https://www.typescriptlang.org/): Language used for the server and front-end.
-   [Quick.DB](https://quick.db/): Used for caching and session storage.
-   [MongoDB](https://www.mongodb.com/): Used for the database.
-   [SCSS](https://sass-lang.com/): Used for the styling.
-   [Discord.js](https://discord.js.org/): Used for Discord's OAuth and to get information from Discord.
-   [Github](https://github.com): Used for the website's version management.
-   [Git](https://git-scm.com/): Used for the website's version management.


<br>
<br>

# Extra Information: 

Author: [Asterki#1765](https://twitter.com/AsterkiDev) <br>
Any Bugs or Issues can be reported [here](https://github.com/Shard-Bot/shardmod/issues). <br>
**This code is provided only with the guarantee of bug fixes for features that already exist, charges will apply if there are new implementations or removals of such.**

<br>
<br>

# License:

Copyright © 2022 <Asterki 2020-2022>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.