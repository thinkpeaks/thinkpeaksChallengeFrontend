import React, {Component} from "react";


export default class SpalshPage extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {}
  }

  handleSubmit(e) {

    if (this.refs.firstName.value == "" || this.refs.lastName.value == "" || !this.refs.privacy.checked || !validateEmail(this.refs.email.value)) {
      this.setState({message: "Please fill the form correctly to play"})
    } else {
      if (isSpecialGuest(this.refs.firstName.value, this.refs.lastName.value)) {
        this.props.makeSpecialGuest();
        this.setState({message: "May the force be with you!", specialGuest: true})
      }

      else {
        this.props.defineChallenger({
          nickName: this.refs.nickName.value,
          firstName: this.refs.firstName.value,
          lastName: this.refs.lastName.value,
          email: this.refs.email.value,
        });
      }
    }

    e.preventDefault();
  }


  render() {

    let message = "";
    let buttonMessage = "Start!";

    if (this.state !== null) {
      if (this.state.message) {
        buttonMessage = this.state.message

      }
      if (this.state.specialGuest) {
        message =
            <p ref="message" className={"blue"}>Well done luke! 2000 extra points will be credited to your score!<br/> Now
            please fill the form with real values"</p>;


      }
    }
    return (
      <div className="splash">
        <h2>Welcome to the Think Peaks Asteroid Challenge</h2>

        <h3>Their is no such challenge without rules!</h3>
        <ul>
          <li>Explode Asteroids to gain points</li>
          <li>Points vary depending on asteroid size (the smaller the higher)</li>
          <li>You will lose 5 points every 20 lost bullets shooted</li>
          <li>Special tricks may apply in the game (check <a href={"https://thinkpeaks.com"}
                                                             target={"_blank"}>thinkpeaks.com</a>)
          </li>
          <li>The three person with the highest score will win the challenge</li>
          <li>Challenge end on 6 march 2019 at 09:00 Brussels Time</li>
          <li>You have the right to cheat</li>

        </ul>


        <h3>Challenger information</h3>

        {message}

        <form>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2">
              </div>
              <div className="col-md-8">

                <p>Please provide us some personal information. We will use them to contact you later if you win the
                  Challenge
                  and
                  for recruitement purpose.</p>

                <div className="container-fluid">

                  <div className="row">
                    <div className="col-md-3"></div>

                    <div className="col-md-6">
                      <label className="hidden" htmlFor="firstname">First name</label>
                      <input ref={"nickName"} type="input" name="nickname" id="nickname" placeholder={"Nick name"}/><br/>
                    </div>
                    <div className="col-md-3"></div>


                  </div>
                    <div className="row">

                    <div className="col-md-6">
                      <label className="hidden" htmlFor="firstname">First name</label>
                      <input ref={"firstName"} type="input" name="firstname" id="firstname" placeholder={"First name"}/><br/>
                    </div>
                    <div className="col-md-6">
                      <label className="hidden" htmlFor="lastname">Last name</label>

                      <input ref={"lastName"} type="input" name="firstname" id="firstname"
                             placeholder={"Last name"}/><br/>

                    </div>
                    <div className="col-md-12">


                      <label className="hidden" htmlFor="email">Email</label>
                      <input ref={"email"} type="input" name="email" id="email" placeholder={"Email"}/><br/>


                    </div>
                    <div className="col-md-12">

                      <input ref={"privacy"} type={"checkbox"} name="privacy" id="privacy"/>
                      <label htmlFor="email">I'm agree with <a href="https://thinkpeaks.com/privacy"
                                                               target={"_blank"}>Think
                        Peaks privacy policies</a></label>
                      <br/>
                      <button
                        className="button" onClick={(event) => this.handleSubmit(event)}>
                        {buttonMessage}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-2">
              </div>


            </div>
          </div>

        </form>


        <i className="fab fa-github"></i>
      </div>
    )
  }
}


function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


function isSpecialGuest(firstName, lastName) {
  return (firstName.toLowerCase() === "darth" && lastName.toLowerCase() === "vader")
}