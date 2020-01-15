import React from 'react'
import './contacts.css'

class Contacts extends React.Component {
    constructor(props){
        super(props)
        this.state = {students: [], tutors: []}
    }

    componentDidMount() {
        fetch("http://localhost:5000/getTutorMatch?",{
            method: 'GET',
            credentials: "include",
            mode: "cors"
        }).then(res => res.json()).then(response => {
            var map = new Map()
            for(var i = 0; i < response.length; i ++){
                var row = response[i]
                var name = row[1] + ", " + row[0]
                if(map.has(name)){
                    var tempLst = map.get(name)
                    var add = " " + row[2] + " with: " + row[3]
                    tempLst.push(add)
                    map.set(name, tempLst)
                }else{
                    var lst = []
                    var entry = row[2] + " with: " + row[3]
                    lst.push(row[4])
                    lst.push(entry)
                    map.set(name, lst)
                }
            }
            this.setState({tutors: map})

        })
        fetch("http://localhost:5000/getStudentMatch?",{
            method: 'GET',
            credentials: "include",
            mode: "cors"
        }).then(res => res.json()).then(response => {
            var map = new Map()
            for(var i = 0; i < response.length; i ++){
                var row = response[i]
                var name = row[1] + ", " + row[0]
                if(map.has(name)){
                    var tempLst = map.get(name)
                    tempLst.push(" " +row[2])
                    map.set(name, tempLst)
                } else {
                    var lst = []
                    lst.push(row[3])
                    lst.push(row[2])
                    map.set(name, lst)
                }
            }
            this.setState({students: map})

        })
    }
    request = (email) => {
        window.location.href = "/requests?email=" + email 
    }
    profile() {
        window.location.href = "/studentprofile"
    }
    contacts() {
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
        var studentrow = []
        var tutorrow = []
        var s_row = this.state.students
        var t_row = this.state.tutors
        for (const [j, d] of s_row.entries()){
            var email = d[0]
            var slst = []
            for (var u = 1; u < d.length; u++) {
                slst.push(d[u])
            }
            var both = <tr key = {u}><td onClick = {this.request.bind(this, email)}><p className = "one">{j}</p><p className = "two">{" is also taking " + slst}</p></td></tr>
            studentrow.push(both)
            u ++;
        }
        for (const [k, x] of t_row.entries()){
            var email = x[0]
            var lst = []
            for (var s = 1; s < x.length; s++) {
                lst.push(x[s])
            }
            var bothofthem = <tr key = {s}><td onClick = {this.request.bind(this, email)}><p className = "one">{k}</p><p className = "two">{" finished " + lst}</p></td></tr>
            tutorrow.push(bothofthem)
            s ++;
        }
        return (
            <div>
                <header id = "header">
                    <nav id = "top">
                        <ul>
                            <li onClick = {this.profile.bind(this)}>Profile</li>
                            <li onClick = {this.contacts.bind(this)}>Contacts</li>
                            <li onClick = {this.logout.bind(this)}>Log Out</li>
                        </ul>
                    </nav>
                </header>
                <h1 className= "firstmsg">Contact a student or a tutor to meet!</h1>
                <h2 className = "secondmsg">Click on their name to a request to talk</h2>
                <div id = "studenttable">
                    <div className="student-container">
                        <table className="contact-options">
                            <thead>
                                <tr>
                                    <th><h3>Students</h3></th>
                                </tr>
                            </thead>
                            <tbody>        
                                {studentrow}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id = "tutortable">
                    <div className="tutor-container">
                        <table className="contact-options">
                            <thead>
                                <tr>
                                    <th><h3>Tutors</h3></th>
                                </tr>
                            </thead>
                            <tbody>        
                                {tutorrow}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
export default Contacts