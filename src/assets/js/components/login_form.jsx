import React, { Fragment, useState } from 'react';
import { hot } from 'react-hot-loader';

export default function LoginForm({ data }) {
  const createSessionPath = JSON.parse(data).createsessionpath;
  const [correct, setCorrect] = useState(2);
  const [userName, setUseName] = useState('');
  const [password, setPassword] = useState('');

  async function fetchServer(e) {
    e.preventDefault();
    const data = {
      username: userName,
      password,
    };
    const ans = await fetch(createSessionPath, { method: 'PUT', body: JSON.stringify(data) }).then((r) => r.json());
    setCorrect(ans.iscorrect);
    if (ans.iscorrect) {
      window.location.replace("/");
    } else {
      setPassword('');
      setUseName('');
    }
  }

  return (
    <>
      <form onSubmit={fetchServer}>
        {/* <input type="hidden" name="_method" value="put" /> */}
        <div className="container">
          <div className="center">
            <h1>Log In</h1>
          </div>
          {correct
            ? null
            : <div>Error de autentificación</div>}
          <div className="form-group center">
            <input
              className="box"
              type="text"
              name="username"
              placeholder="Username"
              onChange={(event) => setUseName(event.target.value)}
              value={userName}
              required
            />
            <br />
          </div>

          <div className="form-group center">
            <input
              className="box"
              type="password"
              name="password"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              required
            />
            <br />
          </div>

          <br />
          <div className="form-group center">
            <input
              className="btn-primary btn"
              type="submit"
              id="submitDetails"
              name="submitDetails"
              value="Sign in"
            />
            <br />
          </div>
        </div>
      </form>
    </>
  );
}

// export default hot(module)(App);
