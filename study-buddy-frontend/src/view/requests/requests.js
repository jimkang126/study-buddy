import React from 'react'
import './requests.css'
import queryString from 'query-string'

class Requests extends React.Component {
    constructor(props){
        super(props)
        this.state = {receiver: "", content: ""}
    }
    componentDidMount(){
        const values = queryString.parse(this.props.location.search)
        var receiver = values.email
        this.setState({receiver: receiver})
    }
    msg(event) {
        this.setState({content: event.target.value})
    }
    goback() {
        fetch ("http://localhost:5000/sendrequest?receiver=" + this.state.receiver + "&content=" + this.state.content ,{
            method: 'POST',
            credentials: "include",
            mode: "cors"
        }).then (
            window.location.href = "/contacts"
        )
    }
    justgoback() {
        window.location.href = "/contacts"
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
                <h1 className= "reqh1">Send a request to start <br></br>messaging your study buddy!</h1>
                <br></br>
                <br></br>
                <br></br>
                <label className= "reqlabel">Message</label>
                <input className = "reqinput" value = {this.state.content} onChange = {this.msg.bind(this)} type = 'text' placeholder = "Request message" size = "65"/>
                <button className = "reqbutton" onClick = {this.goback.bind(this)} type="submit">Send Request</button>
                <br></br>
                <br></br>
                <br></br>
                <button className = "reqbutton2" onClick = {this.justgoback.bind(this)}>Go Back</button>
            </div>
        )
    }
}
export default Requests