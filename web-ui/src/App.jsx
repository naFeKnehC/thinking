import React from 'react';
import {Routes, Route} from 'react-router-dom';

import Chat from "./Chat";

const App = () => {
  return (
    <Routes>
      <Route path={'/'}>
        <Route index element={<Chat/>}/>
      </Route>
    </Routes>
  );
};

export default App;
