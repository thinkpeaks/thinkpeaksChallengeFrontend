import React, {Component} from 'react';
import SplashPage from './SplashPage';
import Ship from './Ship';
import Asteroid from './Asteroid';
import HighScoreTable from './HighScoreTable';
import {randomNumBetweenExcluding} from './helpers'
import {api} from './restApi'
import {settings} from './settings'
import _ from 'lodash';
import sha512 from 'js-sha512';
import Base64 from 'js-base64';

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32,
  ENTER: 13
};


export class Reacteroids extends Component {
  constructor() {
    super();
    this.state = {
      challenger: settings.anonymousChallenger,
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      keys: {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
        space: 0,
        enter: 0,
      },
      asteroidCount: 3,
      currentScore: 0,
      topScore: localStorage['topscore'] || 0,
      highScore: 0,
      inGame: false,
      initializedGame: false,
      initialScore: 0,
      specialGuest: false,
      highScoreTable: null,
      token: ""
    }
    this.ship = [];
    this.asteroids = [];
    this.bullets = [];
    this.particles = [];
  }

  handleResize(value, e) {
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      }
    });
  }

  handleKeys(value, e) {
    let keys = this.state.keys;
    if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value;
    if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value;
    if (e.keyCode === KEY.UP || e.keyCode === KEY.W) keys.up = value;
    if (e.keyCode === KEY.SPACE) keys.space = value;
    if (e.keyCode === KEY.ENTER) keys.enter = value;
    this.setState({
      keys: keys
    });
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.state.initializedGame) {
      if (this.state.initializedGame !== prevState.initializedGame)
        this.startGame();
    }

    if (this.state.highScoreTable === null) {
      this.setState({highScoreTable: false});
      this.getHighScores();

    }
    if (this.state.challenger.lastName !== prevState.challenger.lastName) {
      if (this.state.challenger.lastName !== "Doe") {
        this.setState({initializedGame: true});
      }
    }

  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));
    window.addEventListener('resize', this.handleResize.bind(this, false));

    const context = this.refs.canvas.getContext('2d');
    this.setState({context: context});

    requestAnimationFrame(() => {
      this.update()
    });
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeys);
    window.removeEventListener('keydown', this.handleKeys);
    window.removeEventListener('resize', this.handleResize);
  }

  update() {
    const context = this.state.context;
    const keys = this.state.keys;
    const ship = this.ship[0];


    if (!this.state.initializedGame) {
      return requestAnimationFrame(() => {
        this.update()
      });

    }
    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Motion trail
    context.fillStyle = '#000';
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;

    // Next set of asteroids
    if (!this.asteroids.length) {
      let count = this.state.asteroidCount + 1;
      this.setState({asteroidCount: count});
      this.generateAsteroids(count)
    }

    // Check for colisions
    this.checkCollisionsWith(this.bullets, this.asteroids);
    this.checkCollisionsWith(this.ship, this.asteroids);

    // Remove or render
    this.updateObjects(this.particles, 'particles')
    this.updateObjects(this.asteroids, 'asteroids')
    this.updateObjects(this.bullets, 'bullets')
    this.updateObjects(this.ship, 'ship')

    context.restore();

    // Next frame
    requestAnimationFrame(() => {
      this.update()
    });
  }

  addScore(points) {
    if (this.state.inGame) {
      this.setState({
        currentScore: this.state.currentScore + this.getCoefficient() * points,
      });
    }
  }


  startGame() {

    if (typeof this.state.challenger !== "undefined") {
    }


    this.getToken();


    this.setState({
      inGame: true,
      currentScore: this.state.initialScore
    });

    // Make ship
    let ship = new Ship({
      position: {
        x: this.state.screen.width / 2,
        y: this.state.screen.height / 2
      },
      create: this.createObject.bind(this),
      onDie: this.gameOver.bind(this),
    });
    this.createObject(ship, 'ship');

    // Make asteroids
    this.asteroids = [];
    this.generateAsteroids(this.state.asteroidCount)
  }


  reInitializedGame() {

    this.setState({
      inGame: false,
      specialGuest: false,
      initializedGame: false,
      initialScore: 0,
      challenger: settings.anonymousChallenger,
      topScore: 0
    });
    localStorage['topscore'] = 0;

  }

  initializedGame() {


    this.setState({
      inGame: true,
      initializedGame: true,
    });

  }

  getCoefficient() {
    let coeficient = 1;

    if (this.ship[0].position.x <= this.state.screen.width / 3 & this.ship[0].position.y <= this.state.screen.height / 3) {
      console.log('Yeah! You stepped out of your comfort zone and you\'ll be rewarded for that!')
      coeficient = 2;
    }
    return coeficient;

  }

  gameOver() {
    this.postScore();

    this.setState({
      inGame: false,
    });


    // Replace top score
    if (this.state.currentScore > this.state.topScore) {
      this.setState({
        topScore: this.state.currentScore,
      });
    }
  }

  defineChallenger(challenger) {

    this.setState({
      challenger: challenger,
    });
    if (challenger.specialGuest) {
      this.setState({initialScore: 2000})
      this.addScore(2000)

    }


  }

  getToken() {

    let email = this.state.challenger.email;
    let emailInBase64 = btoa(email)

    let token = api.one('token', emailInBase64).get().then((response) => {
      let results = [];

      let responseReturn = response.body().data();

      this.setState({token: responseReturn.token})


    });
  }

  getHighScores() {
    let highScore = api.custom('highscores').get().then((response) => {
      let results = [];

      let responseReturn = response.body();

      responseReturn.forEach(function (element) {
        results.push(element.data())
      });

      this.setState({highScoreTable: results})
      this.getHighestScore();
      return results;

    });


  }

  getHighestScore() {
    let highScoreTable = _.cloneDeep(this.state.highScoreTable);

    if (highScoreTable === false || highScoreTable === null) {
      return "";
    }
    else {
      let higestScoreParticipation = highScoreTable.sort((a, b) => {
        return b.position - a.position
      }).pop();
      if (typeof higestScoreParticipation !== "undefined") {

        this.setState({highScore: higestScoreParticipation.score})
        return higestScoreParticipation.score;
      }
    }
    return '';

  }

  postScore() {


    let score = {
      nickName: this.state.challenger.nickName,
      firstName: this.state.challenger.firstName,
      lastName: this.state.challenger.lastName,
      email: this.state.challenger.email,
      isSpecialGuest: this.state.specialGuest,
      score: this.state.currentScore,
      token: sha512(this.state.token + settings.frontendSecret),
    }

    api.all('scores').post(score).then(
      () => {
        this.getHighScores()
      });

  }

  makeSpecialGuest() {

    this.setState({
      specialGuest: true,
    });
    this.setState({initialScore: 2000})

    this.addScore(2000)


  }

  generateAsteroids(howMany) {
    let asteroids = [];
    let ship = this.ship[0];
    for (let i = 0; i < howMany; i++) {
      let asteroid = new Asteroid({
        size: 80,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x - 60, ship.position.x + 60),
          y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y - 60, ship.position.y + 60)
        },
        create: this.createObject.bind(this),
        addScore: this.addScore.bind(this),
        specialGuest: this.state.specialGuest
      });
      this.createObject(asteroid, 'asteroids');
    }
  }

  createObject(item, group) {
    this[group].push(item);
  }

  updateObjects(items, group) {
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1);
      } else {
        items[index].render(this.state);
      }
      index++;
    }
  }

  checkCollisionsWith(items1, items2) {
    var a = items1.length - 1;
    var b;
    for (a; a > -1; --a) {
      b = items2.length - 1;
      for (b; b > -1; --b) {
        var item1 = items1[a];
        var item2 = items2[b];
        if (this.checkCollision(item1, item2)) {
          item1.destroy();
          item2.destroy();
        }
      }
    }
  }

  checkCollision(obj1, obj2) {
    var vx = obj1.position.x - obj2.position.x;
    var vy = obj1.position.y - obj2.position.y;
    var length = Math.sqrt(vx * vx + vy * vy);
    if (length < obj1.radius + obj2.radius) {
      return true;
    }
    return false;
  }

  render() {
    let startgame;
    let endgame;
    let message;
    let canvas;
    let ScoreMessage;
    let footer;

    if (this.state.currentScore <= 0) {
      ScoreMessage = '0 points... So sad.';
    }
    else {
      if (this.state.currentScore >= this.state.highScore) {
        ScoreMessage = '' + this.state.currentScore + ' points. Numero Uno! Woo!';

      }
      if (this.state.currentScore >= this.state.topScore & this.state.topScore != 0) {
        ScoreMessage = 'Your best score is ' + this.state.currentScore + ' points. Nice!';
      } else {
        ScoreMessage = this.state.currentScore + ' Points though :)'
      }
    }

    if (!this.state.initializedGame) {
      startgame = (<SplashPage
          defineChallenger={this.defineChallenger.bind(this)} makeSpecialGuest={this.makeSpecialGuest.bind(this)}/>
      )
    }

    if (!this.state.initializedGame) {
      footer = <div id="footer">
        <a href={"https://github.com/thinkpeaks/thinkpeaksChallengeFrontend"} target={"_blank"}> <i
          className="fab fa-github"></i> Fork me on Github</a>
      </div>

    }

    if (!this.state.inGame & this.state.initializedGame) {
      endgame = (
        <div className="endgame">
          <h1>Game over, man!</h1>
          <div className={"row"}>

            <div className={"col-lg-6"}>

              <HighScoreTable highScoreTable={this.state.highScoreTable}/>
            </div>


            <div className={"col-lg-6"}>
              <h2>{ScoreMessage}</h2>
              <button
                onClick={this.startGame.bind(this)}>
                Try again?
              </button>

              <button
                onClick={this.reInitializedGame.bind(this)}>
                Start as a new challenger !
              </button>
            </div>
          </div>

        </div>
      )
    }

    return (
      <div>
        {startgame}
        {endgame}
        <span className="score current-score">Score: {this.state.currentScore}</span>
        <span className="score top-score">Top Score: {this.state.highScore}<br/><span className={'small'}>Your top Score: {this.state.topScore}</span></span>
        <span className="controls">
          <h1>Think Peaks Asteroid Game Challenge</h1>
          Use [←][↑][↓][→] to MOVE. [SPACE] to SHOOT !
        </span>
        <canvas ref="canvas"
                width={this.state.screen.width * this.state.screen.ratio}
                height={this.state.screen.height * this.state.screen.ratio}
        />

        {footer}

      </div>
    );
  }
}
