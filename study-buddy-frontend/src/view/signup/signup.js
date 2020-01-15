import React from 'react'
import './signup.css'

class Signup extends React.Component {
    constructor(props){
        super(props)
        this.state = {firstName: "", lastName: "", email: "", password: "", role: ""}
    }

    firstNameChange(event){
        this.setState({firstName: event.target.value})
    }

    lastNameChange(event){
        this.setState({lastName: event.target.value})
    }

    emailChange(event){
        this.setState({email: event.target.value})
    }

    passwordChange(event){
        this.setState({password: event.target.value})
    }
    roleChange(event){
        this.setState({role: event.target.value})
    }
    logIn(event){
        event.preventDefault()
        window.location.href = "/login"
    }

    signUp(event){
        event.preventDefault()
        fetch("http://localhost:5000/signup?firstname=" + this.state.firstName + "&lastname=" + this.state.lastName + "&email=" + this.state.email + "&password=" + this.state.password + "&role=" + this.state.role ,{
            method: 'POST',
            credentials: "include",
            mode: "cors"
        }).then(res => {
            window.location.href = "/login"
        })
    }

    render(){
        return(
            <div>
                <header id = "signheader">
                    <nav id = "signtop">
                        <ul>
                            <li onClick = {this.signUp.bind(this)}>Sign Up</li>
                            <li onClick = {this.logIn.bind(this)}>Login</li>
                        </ul>
                    </nav>
                </header>
                <div className = "text1">
                    <h1 className = "signuptitle">Sign up</h1>
                    <form className = "all">
                        <label className = "signlabel"><b>First Name</b></label>
                        <input style = {{padding: 3, margin: 10}} onChange = {this.firstNameChange.bind(this)} type = "text" placeholder = "First Name"></input>
                        <br></br>
                        <label className = "signlabel"><b>Last Name</b></label>
                        <input style = {{padding: 3, margin: 10}} onChange = {this.lastNameChange.bind(this)} type = "text" placeholder = "Last Name"></input>
                        <br></br>
                        <label className = "signlabel"><b>Email</b></label>
                        <input style = {{padding: 3, margin: 10}} onChange = {this.emailChange.bind(this)} type = "text" placeholder = "Email"></input>
                        <br></br>
                        <label className = "signlabel"><b>Password</b></label>
                        <input style = {{padding: 3, margin: 10}} onChange = {this.passwordChange.bind(this)} type = "password" placeholder = "Password"></input>
                        <br></br>
                        <label className = "signlabel"><b>Choose to be a Tutor or a Student</b></label>
                        <select style = {{padding: 3, margin: 10}} onChange = {this.roleChange.bind(this)}>
                            <option value="" disabled selected hidden>Select Option</option>
                            <option>Tutor</option>
                            <option>Student</option>
                        </select>
                        <br></br>
                        <button className = "sign1button" disabled={!this.state.firstName} disabled={!this.state.lastName} 
                        disabled={!this.state.email} disabled={!this.state.password} disabled={!this.state.role} 
                        onClick = {this.signUp.bind(this)}>Submit</button>
                    </form>
                </div>
            </div>
        )
    }


}

export default Signup