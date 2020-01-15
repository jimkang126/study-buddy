import React from 'react'
import './current.css'

class Current extends React.Component {
    constructor(props){
        super(props)
        this.state = {class: "", currentClass: [], classList: []}
    }
    delete = (curr_class) => {
        fetch("http://localhost:5000/deletestudentclass?course=" + curr_class, {
            method: "DELETE", 
            credentials: "include", 
            mode: "cors"
        }).then(res => {this.componentDidMount()})
    }
    currentChange(event){
        this.setState({class: event.target.value})
    }
    componentDidMount(){
        fetch("http://localhost:5000/getListofClasses", {
            method: "GET", 
            credentials: "include", 
            mode: "cors"
        }).then(res => res.json()).then(response => {
            this.setState({currentClass: []})
            for(var i = 0; i < response.length; i ++){
                var currList = this.state.currentClass
                var row = response[i]
                currList.push(row[1])
                this.setState({currentClass: currList})
            }
        })
        fetch("http://localhost:5000/dropdown",{
            method: 'GET',
            credentials: "include",
            mode: "cors"
        }).then(res => res.json()).then(response => {
            var classSelectList = []
            for(var i = 0; i < response.length; i ++){
                var classObject = response[i]
                var classOption = <option>{classObject}</option>
                classSelectList.push(classOption)
            }
            this.setState({classList: classSelectList})
        })
    }
    nextPage(event) {
        event.preventDefault()
        window.location.href = "/option"
    }
    currentSubmit(event) {
        event.preventDefault()
        fetch("http://localhost:5000/current?current_class=" + this.state.class ,{
            method: 'POST',
            credentials: "include",
            mode: "cors"
        }).then(res => {
            var aClass = this.state.class
            var currList = this.state.currentClass
            currList.push(aClass)
            this.setState({currentClass: currList})
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
    render() {
        var current = []
        var cur = this.state.currentClass
        for (var i = 0; i < cur.length; i ++){
            var curr_class = cur[i]
            var c_class = <tr><td>{curr_class}</td><td><button onClick = {this.delete.bind(this, curr_class)}>Delete</button></td></tr>
            current.push(c_class)
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
                <div className = "current-text">
                    <h1>Study Buddy</h1>
                    <h2>Please input the classes you are  <br></br> currently taking</h2>
                    <label><b>Class</b></label>
                    <select className = "current-input" onChange = {this.currentChange.bind(this)} type = "text" placeholder = "Class"> 
                        <option value="" disabled selected hidden>Select Class</option>
                        {this.state.classList} 
                    </select>
                    <button className = "addbutton" disabled={!this.state.class} onClick = {this.currentSubmit.bind(this)}>Add</button>
                </div>
                <div id = "currenttable">
                    <div className="current-container">
                        <table className="curr-transcript">
                            <caption className= "caption">Current Classes</caption>
                            <thead>
                                <tr>
                                    <th><h3>Class</h3></th>
                                </tr>
                            </thead>
                        <tbody>        
                            <tr>
                                {current}
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
                <label className = "current-label"><b>Once you are done uploading your</b></label>
                <br></br>
                <label className = "current-label"><b>classes, click submit!</b></label>
                <button className = "submitbutton" onClick = {this.nextPage.bind(this)}>Submit</button>
            </div>
        )
    }
}
export default Current