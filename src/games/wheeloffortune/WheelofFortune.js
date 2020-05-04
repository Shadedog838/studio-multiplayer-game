import GameComponent from "../../GameComponent.js";
import UserApi from "../../UserApi.js";
import React from "react";
import Question from "./Question.js";

export default class WheelofFortune extends GameComponent {
  constructor(props) {
    super(props);
    this.getSessionDatabaseRef().set({ text: "Hello, World!" });
    this.state = {
      last_user_id: null,
      question: "What time is it",
      answers: ["1", "2", "3", "4"],
      response: "[No response yet]",
      user_ids: []
      // whose turn it is
      // points
      // timer (v2)
      // question difficulty
      // correct answer
    };
    this.getPlayers();
  }

  onSessionDataChanged(data) {
    console.log("Data changed", data);
    console.log(this.state.last_user_id + "");
    this.setState({
      last_user_id: data.user_id,
      response: data.response,
      user_ids: data.user_ids
    });
    console.log(this.state.last_user_id + "");
  }

  handleButtonClick() {
    this.getSessionDatabaseRef().set({ user_id: this.getMyUserId() });
  }

  handleSubmitButton() {
    console.log(document.getElementById("response").value);
    this.getSessionDatabaseRef().set({
      user_id: this.getMyUserId(),
      response: document.getElementById("response").value
    });
  }

  getPlayers() {
    this.getSessionDatabaseRef().set({
      user_ids: this.getSessionUserIds()
    });
  }

  render() {
    if (this.getSessionUserIds().length === 3) {
      this.getPlayers();
    }

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
    if (this.state.user_ids != null) {
      var user_ids = this.state.user_ids.map(user_id => (
        <li key={user_id}>{UserApi.getName(user_id)}</li>
      ));
      var first_player = UserApi.getName(this.state.user_ids[0]);
      var player_index = 0;
      // var player_index_max = this.state.user_ids.length;

      if (this.state.user_ids[player_index] === this.getMyUserId()) {
        var input_text_box = <input type="text" id="response" />;
        var submit_button = (
          <button onClick={() => this.handleSubmitButton()}> Submit </button>
        );
      }
    }
    var last_user_message = last_user + " clicked the button!";
    var last_user_with_response =
      last_user + " responded with " + this.state.response;

    return (
      <div>
        <p>Session ID: {id}</p>
        <p>Session Title: {title}</p>
        <p>Session Creator: {creator} </p>
        <p>Me: {me}</p>
        <p>Status: {status}</p>
        <p>Session users: </p>
        <ul>{users}</ul>
        <button onClick={() => this.handleButtonClick()}>Click me!</button>
        <p>{last_user_message}</p>
        <Question question={this.state.question} answers={this.state.answers} />
        <p>
          {input_text_box} {submit_button}
        </p>
        <p> {last_user_with_response} </p>
        <ul> {user_ids} </ul>
        <p> {first_player} </p>
      </div>
    );
  }
}
