import GameComponent from "../../GameComponent.js";
import UserApi from "../../UserApi.js";
import React from "react";
import Question from "./Question.js";
import Wheel from "./SpinningWheel.js";
import question_data from "./Data.js";
import "./WheelofFortune.css";

export default class WheelofFortune extends GameComponent {
  constructor(props) {
    super(props);
    // this.getSessionDatabaseRef().set({ text: "Hello, World!" });
    this.state = {
      last_user_id: null,
      question: question_data,
      answers: ["1", "2", "3", "4"],
      response: "[No response yet]",
      user_ids: [],
      player_index: 0,
      question_index: 0
      // whose turn it is
      // points
      // timer (v2)
      // question difficulty
      // correct answer
    };
  }

  onSessionDataChanged(data) {
    console.log("Data changed", data);
    console.log(this.state.last_user_id + "");
    console.log("player index before " + this.state.player_index);
    this.setState(prevState => ({
      last_user_id: data.user_id,
      response: data.response,
      player_index: data.player_index
    }));
    console.log("player index after " + this.state.player_index);
    console.log("STATE RESPONSE " + this.state.response);
  }

  handleSubmitButton() {
    console.log(document.getElementById("response").value);
    console.log("handle submit button index before " + this.state.player_index);
    var new_index = this.state.player_index;
    if (this.state.player_index === 2) {
      new_index = 0;
    } else {
      new_index = this.state.player_index + 1;
    }

    if (this.state.question_index === this.state.question.length - 1) {
      // insert stuff in here next time!
    }
    this.getSessionDatabaseRef().update({
      user_id: this.getMyUserId(),
      response: document.getElementById("response").value,
      player_index: new_index
    });
    console.log("handle submit button index after " + this.state.player_index);

  }

  render() {
    var id = this.getSessionId();
    var users = this.getSessionUserIds().map(user_id => (
      <li key={user_id}>{UserApi.getName(user_id)}</li>
    ));
    var creator = UserApi.getName(this.getSessionCreatorUserId());
    var title = this.getSessionTitle();
    var me = UserApi.getName(this.getMyUserId());

    var status = "";
    if (this.getMyUserId() === this.getSessionCreatorUserId()) {
      // Display "I am a host"
      status = "I am a host";
    } else {
      // Dipsplay " I am a guest"
      status = "I am a guest";
    }

    var last_user = "No one";
    if (this.state.last_user_id != null) {
      last_user = UserApi.getName(this.state.last_user_id);
    }

    // Using get Session Id here to get all players
    var user_ids = this.getSessionUserIds().map(user_id => (
      <li key={user_id}>{UserApi.getName(user_id)}</li>
    ));
    var player_index = this.state.player_index;
    var current_player = UserApi.getName(
      this.getSessionUserIds()[player_index]
    );
    var player_turn = "It's " + current_player + "'s turn";

    var show_text_box =
      this.getSessionUserIds()[player_index] === this.getMyUserId();

    // if (show_text_box) {
    //   var input_text_box = <input type="text" id="response" />;
    //   var submit_button = (
    //     <button onClick={() => this.handleSubmitButton()}> Submit </button>
    //   );
    // }
    var last_user_with_response =
      last_user + " responded with " + this.state.response;

    return (
      <div className="div">
        {/* <p>Session ID: {id}</p>
        <p>Session Title: {title}</p>
        <p>Session Creator: {creator} </p> */}
        {/* <p>Me: {me}</p> */}
        {/* <p>Status: {status}</p> */}
        <p>Session users: </p>
        <ul>{users}</ul>
        {/* <ul> {user_ids} </ul> */}
        <p> {player_turn} </p>
        <Wheel
          items={this.state.question}
          show_text_box={show_text_box}
          player_index={player_index}
        />
        {/* <p>
          Enter your answer here:
          {input_text_box} {submit_button}
        </p> */}
        <p> {last_user_with_response} </p>
        {/* <p> {this.state.response} </p> */}
      </div>
    );
  }
}
