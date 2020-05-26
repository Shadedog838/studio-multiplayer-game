import GameComponent from "../../GameComponent.js";
import UserApi from "../../UserApi.js";
import React from "react";
import Question from "./Question.js";
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
      points: [0, 0, 0],
      player_index: 0,
      question_index: 0,
      selectedItem: null,
      selected_question: { question: "", answer: "" },
      is_response_correct: false
      // whose turn it is
      // points
      // timer (v2)
      // question difficulty
      // correct answer
    };
    this.selectItem = this.selectItem.bind(this);
  }

  selectItem() {
    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(
        Math.random() * this.state.question.length
      );
      if (this.props.onSelectItem) {
        this.props.onSelectItem(selectedItem);
      }
      let Item =
        this.state.selectedItem === null
          ? this.state.question[selectedItem]
          : this.state.question[selectedItem];
      console.log(Item);
      this.getSessionDatabaseRef().update({
        selected_question: Item
      });
      this.setState({ selectedItem: selectedItem });
    } else {
      this.setState({ selectedItem: null });
      setTimeout(this.selectItem, 500);
    }
  }

  onSessionDataChanged(data) {
    console.log("Data changed", data);
    console.log(this.state.last_user_id + "");
    console.log("player index before " + this.state.player_index);
    this.setState(prevState => ({
      last_user_id: data.user_id,
      response: data.response,
      player_index: data.player_index,
      selected_question: data.selected_question,
      is_response_correct: data.is_response_correct,
      points: data.points
    }));
    console.log("player index after " + this.state.player_index);
    console.log("STATE RESPONSE " + this.state.response);
  }

  handleSubmitButton() {
    console.log(document.getElementById("response").value);
    console.log("handle submit button index before " + this.state.player_index);
    var current_player_index = this.state.player_index;
    var new_index = current_player_index;
    if (current_player_index === 2) {
      new_index = 0;
    } else {
      new_index = current_player_index + 1;
    }

    var is_response_correct =
      document.getElementById("response").value ===
      this.state.selected_question.answer;

    var updated_points;

    console.log("is response correct " + is_response_correct);
    console.log("this.state.points " + this.state.points);

    if (is_response_correct && this.state.points != null) {
      console.log("this state points!!! " + this.state.points);
      var updated_player_points =
        this.state.points[current_player_index] +
        this.state.selected_question.points;

      updated_points = [];
      for (var i = 0; i < this.state.points.length; i++) {
        if (i === current_player_index) {
          updated_points.push(updated_player_points);
        } else {
          updated_points.push(this.state.points[i]);
        }
      }
      console.log("updated points " + updated_points);
    } else if (this.state.points != null) {
      updated_points = this.state.points;
    } else {
      updated_points = [0, 0, 0];
    }

    // if (
    //   document.getElementById("response").value ===
    //   this.state.selected_question.answer
    // ) {
    // }

    this.getSessionDatabaseRef().update({
      user_id: this.getMyUserId(),
      response: document.getElementById("response").value,
      player_index: new_index,
      is_response_correct: is_response_correct,
      points: updated_points
    });
    console.log("handle submit button index after " + this.state.player_index);
  }

  render() {
    const { selectedItem } = this.state;
    // const { items } = this.state.question;

    const wheelVars = {
      "--nb-item": this.state.question.length,
      "--selected-item": selectedItem
    };
    const spinning = selectedItem !== null ? "spinning" : "";

    var id = this.getSessionId();
    console.log("display points");
    if (this.state.points != null) {
      console.log("points is not null");
      var points = this.state.points;
    } else {
      console.log("points is null");
      points = [];
    }
    var users = this.getSessionUserIds().map((user_id, index) => (
      <li key={user_id}>
        {UserApi.getName(user_id)} -----> {points[index]}
      </li>
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

    if (this.state.selected_question != null) {
      var selected_question = this.state.selected_question.question;
    }

    var show_text_box =
      this.getSessionUserIds()[player_index] === this.getMyUserId();

    if (show_text_box) {
      var input_text_box = <input type="text" id="response" />;
      var submit_button = (
        <button onClick={() => this.handleSubmitButton()}> Submit </button>
      );
    }
    var last_user_with_response =
      last_user + " responded with " + this.state.response;

    return (
      <div className="div">
        <div className="wheel-container">
          <div
            className={`wheel ${spinning}`}
            style={wheelVars}
            onClick={this.selectItem}
          >
            {this.state.question.map((item, index) => (
              <div
                className="wheel-item"
                key={index}
                style={{ "--item-nb": index }}
              >
                {item.question}
              </div>
            ))}
          </div>
          <br />
        </div>
        {/* <p>Session ID: {id}</p>
        <p>Session Title: {title}</p>
        <p>Session Creator: {creator} </p> */}
        {/* <p>Me: {me}</p> */}
        {/* <p>Status: {status}</p> */}
        <p>Session users: </p>
        <ul>{users}</ul>
        {/* <ul> {user_ids} </ul> */}
        <p> {player_turn} </p>
        <p> Question is: {selected_question} </p>
        <p>
          Enter your answer here:
          {input_text_box} {submit_button}
        </p>
        <p> {last_user_with_response} </p>
        <p> Is the response correct? {this.state.is_response_correct + ""} </p>
      </div>
    );
  }
}
