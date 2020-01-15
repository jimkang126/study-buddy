import React from 'react'
import './login.css'

class Login extends React.Component {
    constructor(props){
        super(props)
        this.state = {email: "", password: "", type: "", statusMessage: ""}
    }

    emailChange(event){
        this.setState({email: event.target.value})
    }

    passwordChange(event){
        this.setState({password: event.target.value})
    }
    typeChange(event){
        this.setState({type: event.target.value})
    }
    loginAttempt(event){
        event.preventDefault()
        fetch("http://localhost:5000/login?email=" + this.state.email + "&password=" + this.state.password + "&role=" + this.state.type ,{
            method: 'POST',
            credentials: "include",
            mode: "cors"
        }).then(result => result.json()).then(res => {
            if(Object.keys(res).length === 0){
                this.setState({statusMessage: "Wrong login information"})
            } else {
                if(this.state.type == "Student"){
                    window.location.href = "/current"
                }else if(this.state.type == "Tutor"){
                    window.location.href = "/classes"
                }
            }
        })
    }
    logIn() {
        window.location.href = "/login"
    }

    signUp(){
        window.location.href = "/signup"
    }

    render(){
        return(
            <div>
                <header id = "logheader">
                    <nav id = "logtop">
                        <ul>
                            <li onClick = {this.signUp.bind(this)}>Sign Up</li>
                            <li onClick = {this.logIn.bind(this)}>Login</li>
                        </ul>
                    </nav>
                </header>
                <div className = "logtext">
                    <h1 className = "logintitle">Login</h1>
                    <form>
                        <label className = "loglabel"><b>Email</b></label>
                        <input style = {{padding: 3, margin: 10}} onChange = {this.emailChange.bind(this)} type = "text" placeholder = "Email"></input>
                        <br></br>
                        <label className = "loglabel"><b>Password</b></label>
                        <input style = {{padding: 3, margin: 10}} onChange = {this.passwordChange.bind(this)} type = "password" placeholder = "Password"></input>
                        <br></br>
                        <label className = "loglabel"><b>Are you a Tutor or a Student?</b></label>
                        <select style = {{padding: 3, margin: 10}} onChange = {this.typeChange.bind(this)}>
                            <option value="" disabled selected hidden>Select Option</option>
                            <option>Tutor</option>
                            <option>Student</option>
                        </select>
                        <br></br>
                        <button onClick = {this.loginAttempt.bind(this)}>Log in</button>
                        <br></br>
                        {this.state.statusMessage}
                    </form>
                </div>
            </div>
        )
    }
}
export default Login