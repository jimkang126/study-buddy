import React from 'react'
import './messaging.css'
import queryString from 'query-string'

class Messaging extends React.Component {
    constructor(props){
        super(props)
        this.state = {message: "", receiver: "", messages: []}
    }
    componentDidMount(){
        const values = queryString.parse(this.props.location.search)
        var receiver = values.email
        this.setState({receiver: receiver})
        fetch ("http://localhost:5000/getmessage?receiver=" + receiver ,{
            method: 'GET',
            credentials: "include",
            mode: "cors"
        }).then(res => res.json()).then(response => {
            var msgs = []
            for(var i = 0; i < response.length; i ++){
                var row = response[i]
                var sender = row[0]
                var content = row[2]
                var time = row[3]
                if (sender != receiver){
                    var sentmsg = <div className = "senderside" key = {i}>
                        <caption className = "msgcaption">{time}</caption>
                        <p className = "sendmsg">{content}</p>
                    </div>
                    msgs.push(sentmsg)
                } else {
                    var receivedmsg = <div key = {i}> 
                        <caption className = "msgcaption">{time}</caption>
                        <p className = "receive">{content}</p>
                    </div>
                    msgs.push(receivedmsg)
                }
            }
            this.setState({messages: msgs})
        })
    }
    msgChange(event) {
        this.setState({message: event.target.value})
    }
    sendMsg(event){
        event.preventDefault()
        fetch ("http://localhost:5000/messages?message=" + this.state.message + "&receiver=" + this.state.receiver ,{
            method: 'POST',
            credentials: "include",
            mode: "cors"
        }).then(res => res.text()).then(result => {
            this.componentDidMount()
            this.setState({message: ""})
        })
    }
    render(){
        return (
            <div>
                <h1 className= "msgheader">Message your Study Buddy!</h1>
                <div className= "messagesfeature">
                    {this.state.messages}
                </div>
                <form className="message" action="">
                    <input value = {this.state.message} onChange = {this.msgChange.bind(this)} name="usermsg" type="text" id="usermsg" placeholder = "Message" size="265"/>
                    <button onClick={this.sendMsg.bind(this)} className= "messagingbutton" type="submit">Send</button>
                </form>
            </div>
        )
    }
}
export default Messaging
