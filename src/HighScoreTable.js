import React, {Component} from 'react';
import SplashPage from './SplashPage';
import Ship from './Ship';
import Asteroid from './Asteroid';
import {randomNumBetweenExcluding} from './helpers'
import {api} from './restApi'
import {settings} from './settings'
import _ from 'lodash';


export default class HighScoreTable extends Component {
  constructor() {

    super();

  }


  render() {


    let tableRow = this.props.highScoreTable.map(
      (score, id) => {
        return <tr ref={id}>
          <td>{score.nickName}</td>
          <td>{score.score}</td>
        </tr>
      }
    )

    return (
      <div id={"high-score-table"}>

        <h2><i className={"fa fa-trophy"}/> High Scores</h2>
        <table>
          <tbody>
          {tableRow}
          </tbody>
        </table>

      </div>
    );
  }
}
