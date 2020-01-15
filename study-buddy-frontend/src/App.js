import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Homepage from './view/homepage/homepage.js'
import Signup from './view/signup/signup.js'
import Login from './view/login/login.js'
import Classes from './view/classes/classes.js'
import Current from './view/current/current.js'
import Option from './view/option/option.js'
import Contacts from './view/contacts/contacts.js'
import StudentProfile from './view/studentprofile/studentprofile.js'
import TutorProfile from './view/tutorprofile/tutorprofile.js'
import Messaging from './view/messaging/messaging.js'
import Requests from './view/requests/requests.js'

class App extends React.Component {
  render(){
    return(
      <Router>
        <Route exact path= '/' component= {Homepage}/>
        <Route path = "/signup" component= {Signup}/>
        <Route path = "/login" component= {Login}/>
        <Route path = "/classes" component= {Classes}/>
        <Route path = "/current" component= {Current}/>
        <Route path = "/option" component= {Option}/>
        <Route path = "/contacts" component= {Contacts}/>
        <Route path = "/studentprofile" component= {StudentProfile}/>
        <Route path = "/tutorprofile" component= {TutorProfile}/>
        <Route path = "/messaging" component= {Messaging}/>
        <Route path = "/requests" component= {Requests}/>
      </Router>
    )
  }
}
export default App;
