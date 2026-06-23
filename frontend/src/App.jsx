import "./App.css";

import Header from "./components/Header";
import TextField from "./components/TextField";
import Button from "./components/Button";

function App() {
  const handleSubmit = () => {
    console.log("Button clicked");
  };

  return (
    <>
      <Header />
      <TextField />
      <Button onSubmit={handleSubmit} />
    </>
  );
}

export default App;