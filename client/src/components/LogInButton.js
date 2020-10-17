import React from 'react';
import { useDispatch } from 'react-redux';
import { loggedIn } from '../actions';
import { useHistory } from 'react-router-dom'

function LogInButton(props) {

  const dispatch = useDispatch();
  const history = useHistory();

  function redirectToWhenLoggedIn() {
    history.push('/gallery');
    window.location.reload(); // fix redirection for gallery navlink
  }


  return (
    <div>
      <button type='submit' style={{ backgroundColor: "#6e967a", color: "#fff", fontSize: "1.5em" }} className="btn mt-3 container"
        onClick={(e) => {
          props.onSignUp(e)
          dispatch(loggedIn());
          redirectToWhenLoggedIn(); //redirect when it answers yes
        }}>Login</button>
    </div>
  );
}

export default LogInButton;