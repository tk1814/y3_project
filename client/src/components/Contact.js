import React, { Component } from 'react';

class Contact extends Component {
  render() {
    return (
        <div>
          <h2>Contact</h2>
        </div>
    );
  }
}

// const Contact = () => {
//     const [seconds, setSeconds] = useState(0);
  
//     useEffect(() => {
//       const interval = setInterval(() => {
//         setSeconds(seconds => seconds + 1);
//         console.log('repeat')
        
//       }, 1000);
//       return () => clearInterval(interval);
//     }, []);
  
//     return (
//       <div className="App">
//         <header className="App-header">
//           {seconds} seconds have elapsed since mounting.
//         </header>
//       </div>
//     );
//   };

export default Contact;