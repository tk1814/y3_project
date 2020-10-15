import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { loggedIn } from './actions';
// import { useHistory } from 'react-router-dom';

function LogInButton(props) {

  const dispatch = useDispatch(); 

  return (
    <div>

      <button type='submit' style={{backgroundColor:"#222", color:"#9AEDED", fontSize:"1.5em" }} className="btn mt-3 container" 
      onClick={(e) => {
        props.onSignUp(e)
        dispatch(loggedIn());
        // window.location.href="/about";
      }}>Sign up/Login</button>

    </div>
  );
}

export default LogInButton;