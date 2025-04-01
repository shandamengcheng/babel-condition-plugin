import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Choose>
        <When condition={count > 3}>
          <h1>Vite + React</h1>
        </When>
        <Otherwise>
          <h1>Hello World</h1>
        </Otherwise>
      </Choose>

      <If condition={count > 3}>
        <h1>Vite + React</h1>
      </If>

      <Switch value={count}>
        <Case value={1}>
          <h1>Hello World 1</h1>
        </Case>
        <Case value={2}>
          <h1>Hello World 2</h1>
        </Case>
        <Case value={3}>
          <h1>Hello World 3</h1>
        </Case>
        <Default>
          <h1>Hello World</h1>
        </Default>
      </Switch>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count} (+1)
        </button>
      </div>
    </div>
  );
}

export default App;
