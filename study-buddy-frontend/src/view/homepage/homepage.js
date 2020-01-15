import React from 'react'
import './homepage.css'
 class Homepage extends React.Component{
    constructor(props){
        super(props)
        this.state = {title: ""}
    }
    logIn(){
        window.location.href = "/login"
    }

    signUp(){
        window.location.href = "/signup"
    }

    render(){
        return(
            <div className= "wrapper">
                <header id = "header">
                    <nav id = "top">
                        <ul>
                            <li onClick = {this.signUp.bind(this)}>Sign Up</li>
                            <li onClick = {this.logIn.bind(this)}>Login</li>
                        </ul>
                    </nav>
                </header>
                <div className = "text">
                    <h1 className = "hometitle">Welcome to Study Buddy!</h1>
                    <h2 className = "description">We are here to help students obtain faster and more accessible aid in their courses, 
                        along with allowing them to make new study buddies that can become lifelong friends.</h2>
                    <button className = "logbutton" onClick = {this.logIn.bind(this)}>Log in</button>
                    <button className = "signbutton" onClick = {this.signUp.bind(this)}>Sign up</button>
                </div>
            </div>
        )
    }
 }

 export default Homepage