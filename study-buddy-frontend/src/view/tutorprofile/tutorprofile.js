import React from 'react'
import './tutorprofile.css'

class TutorProfile extends React.Component {
    constructor(props){
        super(props)
        this.state = {tutorInfo: [],tutorClasses: [], component: [], tutorGrades: [], requests: [], names: [], emails: []}
    }
    componentDidMount() {
        fetch("http://localhost:5000/userinfo?",{
            method: 'GET',
            credentials: "include",
            mode: "cors"
        }).then(res => res.json()).then(response => {
            for(var i = 0; i < response.length; i ++){
                var info = this.state.tutorInfo
                var row = response[i]
                info.push(row[1], row[2], row[3], row[0])
                this.setState({tutorInfo: info})
            }
        })
        fetch("http://localhost:5000/tutorclasses?",{
            method: 'GET',
            credentials: "include",
            mode: "cors"
        }).then(res => res.json()).then(response => {
            for(var i = 0; i < response.length; i ++){
                var classes = this.state.tutorClasses
                var grades = this.state.tutorGrades
                var row = response[i]
                classes.push(row[1])
                grades.push(row[2])
                this.setState({tutorClasses: classes, tutorGrades: grades})
            }
        })
    }
    editClasses(){
        window.location.href = "/classes"
    }
    startmsg = (i) => { 
        fetch("http://localhost:5000/updateRequest?receiver=" + this.state.emails[i],{
            method: 'POST',
            credentials: "include",
            mode: "cors"
        }).then(res=>{
            this.getRequests()
        })
    }
    delete = (i) =>{
        fetch("http://localhost:5000/deleterequest?receiver=" + this.state.emails[i],{
            method: 'DELETE',
            credentials: "include",
            mode: "cors"
        }).then(()=>{
            this.getRequests()
        })
    }
    logout() {
        fetch("http://localhost:5000/logout?",{
            method: 'POST',
            credentials: "include",
            mode: "cors"
        })
        window.location.href = "/login"
    }
    request(event){
        event.preventDefault()
        this.getRequests()
    }
    getRequests(){
        var lstNames = []
        var lstEmails = []
        var contents = []
        fetch("http://localhost:5000/getrequests?",{
            method: 'GET',
            credentials: "include",
            mode: "cors"
        }).then(res => res.json()).then(response => {
            for(var i = 0; i < response.length; i ++){
                var row = response[i]
                var email = row[0]
                var content = row[2]
                var firstname = row[4]
                var lastname = row[5]
                var fullname = firstname + " " + lastname
                lstNames.push(fullname)
                lstEmails.push(email)
                contents.push(content)
            }
            this.setState({names: lstNames})
            this.setState({emails: lstEmails})
            this.setState({requests: contents})
        }).then(()=>{
            var allnames = this.state.names
            var allreq = this.state.requests
            var lstComp = []
            for (var i = 0; i < allnames.length; i ++) {
                var n = allnames[i]
                var r = allreq[i]
                var comp = <tr key = {i}><td className = "tdreq"><p className = "reqname">{n}</p><p className = "reqmsg">{"says:"} {r} <div className= "requestingbuttons"><button className = "reqaccept" onClick = {this.startmsg.bind(this, i)}>Accept</button><button className = "reqdecline" onClick = {this.delete.bind(this, i)}>Decline</button></div></p></td></tr>
                lstComp.push(comp)
            }
            this.setState({component: lstComp})
        })
    }
    goToMessaging = (email) => {
        window.location.href = "/messaging?email=" + email
    }
    messages(event){
        event.preventDefault()
        fetch("http://localhost:5000/getAcceptedRequests?",{
            method: 'GET',
            credentials: "include",
            mode: "cors"
        }).then(res => res.json()).then(response => {
            var lstComp = []
            for(var i = 0; i < response.length; i ++){
                var row = response[i]
                var email = row[0]
                var firstname = row[1]
                var lastname = row[2]
                var comp = <tr key = {i}><td className = "msgtd"><p className= "msgname">{firstname + " " + lastname} <div className= "chatbuttonprofile"><button className = "msgbutton" onClick = {this.goToMessaging.bind(this, email)}>Chat</button></div></p></td></tr> 
                lstComp.push(comp)
            }
            this.setState({component: lstComp})
        })
    }
    render() {
        var i_row = this.state.tutorInfo
        var name = i_row[0] + ' ' + i_row[1]
        var role = i_row[2]
        var email = i_row[3]
        var rows = []
        var c_row = this.state.tutorClasses
        var g_row = this.state.tutorGrades
        for (var i = 0; i < c_row.length; i ++){
            var classes = c_row[i]
            var grades = g_row[i]
            var both = <tr key = {i}><td>{classes}</td><td>{grades}</td></tr>
            rows.push(both)
        }
        return (
            <div>
                <header id = "header">
                    <nav id = "top">
                        <ul>
                            <li onClick = {this.logout.bind(this)}>Log Out</li>
                        </ul>
                    </nav>
                </header>
                <h1 className= "studenth1">Good Evening, {name}</h1>
                <div>
                    <div className= "studenttext">
                        <p>Type: {role}</p>
                        <p>Email: {email}</p>
                    </div>
                    <div id = "classtable">
                        <div className="class-container">
                            <table className="transcript">
                                <caption className= "caption">Transcript</caption>
                                <thead>
                                    <tr>
                                        <th><h3>Class</h3></th>
                                        <th><h3>Grade</h3></th>
                                    </tr>
                                </thead>
                                <tbody>        
                                    {rows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <button className = "editbutton" onClick = {this.editClasses.bind(this)}>Edit Classes</button>
                <br />
                <br />
                <br />
                <div>
                    <div className = "tabtitle">
                        <button className = "requests" onClick = {this.request.bind(this)}>Requests</button>
                    </div>
                    <div className = "tabtitle2">
                        <button className = "messages" onClick = {this.messages.bind(this)}>Messages</button>
                    </div>
                    <p className = "component">{this.state.component}</p>
                </div>
            </div>
        )
    }
}
export default TutorProfile