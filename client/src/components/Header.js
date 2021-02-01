import React from 'react';
// import logo from '../bg/ethereum-1.svg'
// import logo from '../bg/ethereum-classic-etc.svg'
import logo from '../bg/SwiftLock.png'

/* must have a root/parent node <header or array of jsx components [ child nodes have col- classes ] */
// props object - read only obj
const Header = (props) => (
  <header className="row">
    <div className="col-md-5">
      <img src={logo} className="logo" alt="logo" />
    </div>
    <div className="col-md-7 subtitle">
      {props.subtitle}
    </div>
  </header>
);

export default Header; // custom component better start with capital

