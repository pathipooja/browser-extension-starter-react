import React from 'react';
import ReactDOM from 'react-dom';
import ButtonComponent from './button/button.component';

require('./index.scss');

function App() {
    return (
        <div className="main">
            <p>Hello</p>
            <ButtonComponent />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
