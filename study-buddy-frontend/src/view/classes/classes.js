import React from 'react'
import './classes.css'

class Classes extends React.Component {
    constructor(props){
        super(props)
        this.state = {class: "", grade: "", rowClass : [], rowGrade : [], gradeOptions:[], classList: []}
    }

    classChange(event){
        this.setState({class: event.target.value})
    }

    gradeChange(event){
        this.setState({grade: event.target.value})
    }

    componentDidMount(){
        this.createGrades()
        fetch("http://localhost:5000/getClasses", {
            method: "GET", 
            credentials: "include", 
            mode: "cors"
        }).then(res => res.json()).then(response => {
            this.setState({rowClass: [], rowGrade: []})
            for(var i = 0; i < response.length; i ++){
                var classList = this.state.rowClass
                var gradeList = this.state.rowGrade
                var row = response[i]
                classList.push(row[1])
                gradeList.push(row[2])
                this.setState({rowClass: classList, rowGrade: gradeList})
            }
        })
        fetch("http://localhost:5000/dropdown",{
            method: 'GET',
            credentials: "include",
            mode: "cors"
        }).then(res => res.json()).then(response => {
            var classSelectList = []
            for(var i = 0; i < response.length; i ++) {
                var classObject = response[i]
                var classOption = <option>{classObject}</option>
                classSelectList.push(classOption)
            }
            this.setState({classList: classSelectList})
        })
    }
    createGrades(){
        var gradesOptionsList = []
        var options = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"]
        for(var i = 0; i < options.length; i ++){
            var option = options[i]
            var currentOption = <option key = {i}>{option}</option>
            gradesOptionsList.push(currentOption)
        }
        this.setState({gradeOptions: gradesOptionsList})       
    }
    classesSubmit(event) {
        event.preventDefault()
        fetch("http://localhost:5000/classes?a_class=" + this.state.class + "&grade=" + this.state.grade ,{
            method: 'POST',
            credentials: "include",
            mode: "cors"
        }).then(res => {
            var currentClass = this.state.class
            var currentGrade = this.state.grade
            var rowClassList = this.state.rowClass
            var rowGradeList = this.state.rowGrade
            rowClassList.push(currentClass)
            rowGradeList.push(currentGrade)
            this.setState({rowClass: rowClassList, rowGrade: rowGradeList})
            this.createGrades()
        })
    }
    nextPage(event) {
        event.preventDefault()
        window.location.href = "/tutorprofile"
    }
    delete = (classes) => {
        fetch("http://localhost:5000/deletetutorclass?course=" + classes, {
            method: "DELETE", 
            credentials: "include", 
            mode: "cors"
        }).then(res=> {this.componentDidMount()})
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
        var rows = []
        var c_row = this.state.rowClass
        var g_row = this.state.rowGrade
        for (var i = 0; i < c_row.length; i ++){
            var classes = c_row[i]
            var grades = g_row[i]
            var both = <tr key = {i}><td>{classes}</td><td>{grades}</td><td><button onClick = {this.delete.bind(this, classes)}>Delete</button></td></tr>
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
                <div className = "class-text">
                    <h1>Study Buddy</h1>
                    <h2>Please input your classes and <br></br> the grade you got in that class</h2>
                    <label className = "class-label"><b>Class</b></label>
                    <select className = "class-input" onChange = {this.classChange.bind(this)} type = "text" placeholder = "Class">
                        <option value="" disabled selected hidden>Select Class</option>
                        {this.state.classList} 
                    </select>
                    <label className = "class-label"><b>Grade</b></label>
                    <select className = "select-grade" onChange = {this.gradeChange.bind(this)}>
                        <option value="" disabled selected hidden>Select Grade</option>
                        {this.state.gradeOptions}
                    </select>
                    <button className = "add-button" disabled={!this.state.class} disabled={!this.state.grade} onClick = {this.classesSubmit.bind(this)}>Add</button>
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
                <label className = "class-label"><b>Once you are done uploading your classes</b></label>
                <br></br>
                <label className = "class-label"><b>and their grades, click submit!</b></label>
                <button className = "submit-button" onClick = {this.nextPage.bind(this)}>Submit</button>
            </div>
        )
    }
}
export default Classes