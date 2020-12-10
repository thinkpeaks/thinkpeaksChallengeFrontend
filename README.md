# Think Peaks Asteroid Challenge	
Hi !
Welcome to Think Peaks asteroid challenge.
The challenge is simple: Get the higest points to win a Nintendo classic Mini.

## There is no such challenge without rules
- Explode Asteroids to gain points
- Points received depends on asteroid size (the smaller the higher)
- You will lose 5 points for every 20 lost bullets shooted
- Special tricks may apply in the game (inspect thinkpeaks.com)
- The person with the highest score will win the challenge 
- You have the right to cheat
- Challenge end on 8 march 2019 at 09:00 Brussels Time

# About the code source.

This is a simple React Web Application with canvas for animation.
It is connected to a RestFull Symfony V4 PHP backend to log scores.
Browse the source code we hope you will learn a few things :)

* Code source of frontend is available here: https://github.com/thinkpeaks/thinkpeaksChallengeFrontend
* Code source of backend is available here: https://github.com/thinkpeaks/thinkpeaksChallengeBackend

### Development

Pull request are accepted for sure !

### Installation

Clone the frontend repo.
Copy src/settings.js.example to  src/settings.js. 
Adapt value to your local instance.

```sh
git init
git add remote origin git@github.com:thinkpeaks/thinkpeaksChallengeFrontend.git
git fetch
git pull origin master
mv  src/settings.js.example to  src/settings.js
nano  src/settings.js
```
Note that the frontend secret should be the same that in the Backend sources.

Install the dependencies and devDependencies and start the server.

```sh
$ npm install
$ npm update
$ npm start
```

Open your browser and go to localhost:3000


### Challenges


 - **Challenge A**: Hack the game and make the highest score here: https://challenge.thinkpeaks.com/
 - **Challenge B**: Write Tests
 - **Challenge C**: Fetch personal highscore of specific email adresse
 - **Challenge E**: upgrade to React 16
 - **Challenge F**: Improve the 'Your top Score: ' display with real time value
 - **Challenge G**: Convert state to redux
 - **Challenge H**: Integrate PushBullet Services
 - **Challenge I**: Surprise us !


### Credits
All the work is derived from https://github.com/chriz001/Reacteroids

License
----

CC0 1.0 Universal

