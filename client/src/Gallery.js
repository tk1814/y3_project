import React from 'react';
import { useSelector } from 'react-redux'; 

function Galley(props) {

  let isLogged = useSelector(state => state.isLogged); 

  return (
    <div>
        {isLogged ? props.imageItems : <p>User not logged in to display images</p> }
    </div>
  );
}

export default Galley;