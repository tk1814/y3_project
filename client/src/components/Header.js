import React from 'react';
import logo from './ethereum-1.svg'

/* must have a root/parent node <header or array of jsx components [ child nodes have col- classes ] */
// props object - read only obj
const Header = (props) => (
    <header className="row">
        {/* logo spin  App-logo */}
        <div className="col-md-5">  
            <img src={logo} className="logo" alt="logo" />
        </div>
        <div className="col-md-7 mt-3 subtitle">
            {props.subtitle}
        </div>
    </header>
);

export default Header; // custom component better start with capital

