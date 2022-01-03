import ReactDOM from "react-dom";
import React from "react";
import App from "./App";
import "./index.css";

import reducer,{initialState} from "./Reducer";
import {StateProvider} from "./StateProvider";

ReactDOM.render(
    <React.StrictMode>
        <StateProvider initialState={initialState} reducer={reducer}>
            <App/>
        </StateProvider>
    </React.StrictMode>
,document.getElementById('root'));