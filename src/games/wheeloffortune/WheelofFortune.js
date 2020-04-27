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
      answers: ["1", "2", "3", "4"]
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
    this.setState({ last_user_id: data.user_id });
    console.log(this.state.last_user_id + "");
  }

  handleButtonClick() {
    this.getSessionDatabaseRef().set({ user_id: this.getMyUserId() });
  }

  handleSubmitButton() {
    console.log(document.getElementById("answer").value);
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
    var last_user_message = last_user + " clicked the button!";
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
        <input type="text" id="answer" />
        <button onClick={() => this.handleSubmitButton()}> Submit </button>
      </div>
    );
  }
}
