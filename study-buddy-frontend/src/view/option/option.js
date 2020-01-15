import React from 'react'
import './option.css'

class Option extends React.Component {
    toContacts(event) {
        event.preventDefault()
        window.location.href = "/contacts"
    }
    toProfile(event) {
        event.preventDefault()
        window.location.href = "/studentprofile"
    }
    logout() {
        fetch("http://localhost:5000/logout?",{
            method: 'POST',
            credentials: "include",
            mode: "cors"
        })
        window.location.href = "/login"
    }
    render() {
        return (
            <div>
                <header id = "header">
                    <nav id = "top">
                        <ul>
                            <li onClick = {this.logout.bind(this)}>Log Out</li>
                        </ul>
                    </nav>
                </header>
                <div className = "everything">
                    <div className = "option-header">
                        <h1>What would you like to do?</h1>
                    </div>
                    <div className = "first">
                        <label>Here you can find tutors for your classes, or 
                            other students that are in your class!</label>
                        <br></br>
                        <button className = "contact-button" onClick = {this.toContacts.bind(this)}>Contacts</button>
                    </div>
                    <br></br>
                    <div className = "second">
                        <label>Here you can view your profile, your previous messaging chats, and message requests!</label>
                        <br></br>
                        <button className = "profile-button" onClick = {this.toProfile.bind(this)}>Profile</button>
                    </div>
                </div>
            </div>
        )
    }
}
export default Option