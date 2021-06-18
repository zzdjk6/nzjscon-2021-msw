import React from "react";
import "./App.css";
import get from "lodash/get";

const App: React.FC = () => {
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    fetch("/api/me")
      .then((response) => response.json())
      .then((data) => get(data, "name"))
      .then(setName);
  }, []);

  return <div className="App">Hello, {name}</div>;
};

export default App;
