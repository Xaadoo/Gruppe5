import React from "react";
import ReactDOM from "react-dom";

class Innlogging extends React.Component {
  constructor(props) {
    super(props);

    this.Brukernavn = {value: ""};
    this.Passord = {value: ""};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert("A log in request was sent! Brukernavn: " + this.Brukernavn.value + "Passord: " + this.Passord.value);
    event.preventdeDefault();
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <label>
          Brukernavn:
          <input type="text" value={this.Brukernavn.value} onChange={this.handleChange} />
          Passord:
          <input type="password" value={this.Passord.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="submit" />
      </form>
    );
  }
}

ReactDOM.render(
  <Innlogging />,
  document.getElementById("root")
);
