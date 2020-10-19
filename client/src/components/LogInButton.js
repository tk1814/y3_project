import React from 'react';
import { useDispatch } from 'react-redux';
import { loggedIn } from '../actions';
import { useHistory } from 'react-router-dom'

function LogInButton(props) {

  const dispatch = useDispatch();

  return (
    <div>
      <button type='submit' className="btn mt-3 container log_in_btn"
        onClick={(e) => {
          props.onSignUp(e)
          dispatch(loggedIn());
        }}>Login</button>
    </div>
  );
}

export default LogInButton;