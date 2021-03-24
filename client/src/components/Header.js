import React from 'react';
import logo from '../bg/logo_lok15.png'

const Header = (props) => (
  <header className="row">
    <div>
      <img src={logo} className="logo" alt="logo" />
    </div>
    <div className="col-md-7 subtitle">
      {props.subtitle}
    </div>
  </header>
);

export default Header;

