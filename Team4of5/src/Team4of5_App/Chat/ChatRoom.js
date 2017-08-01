import React from 'react';
import ReactDOM from 'react-dom';
import './ChatRoom.css'
import { ChatFeed, Message } from 'react-chat-ui'
import { connect } from 'react-redux'
import * as ChatService from '../../Team4of5_Service/Chat.js';
import * as UserService from '../../Team4of5_Service/Users.js';
import Select from 'react-select';
import {
    Grid, Row, Col, Thumbnail, Button, MenuItem,
    DropdownButton, ButtonToolbar, Media, Image
} from 'react-bootstrap';

//Reference: https://github.com/brandonmowat/react-chat-ui/


const chatMemBar = (self) => {
    return (
        <Select
            style={{ width: 150, marginTop: 12 }}
            autosize
            //ref="stateSelect"
            placeholder="Members"
            autofocus
            options={self.state.members}
            simpleValue
            clearable={false}
            name="members"
            disabled={false}
            //value={this.state.selectValue}
            //onChange={this.updateValue}
            searchable={false} />
    )

}
class ChatRoom extends React.Component {
    constructor(props) {
        console.log(2)
        super(props)
        this.state = {
            members: [],
            hasInit: false,
            messages: [
                //(new Message({ id: 1, message: "Hey guys!!!!!!" })),
                //(new Message({ id: 2, message: "Hey! Johny here." }))
            ],
            curr_user: 0
        }
        console.log("Initialize: " + UserService.getCurrentUser().uid)
        this.initialize = this.initialize.bind(this);
        this.addMsgToRoom = this.addMsgToRoom.bind(this);
    }

    componentDidMount() {
        if (this.state.hasInit == false) {
            this.initialize();
        }
    }

    componentWillMount() {
        console.log(4)
    }
    initialize() {
        if (this.state.hasInit == false) {
            this.state.hasInit = true
        }
        let self = this;
        let contactData = { uid: this.props.extraData.ContactUid, data: this.props.extraData.ContactData };
        console.log(this.props.extraData);
        console.log(contactData);
        // if (contactData.type == 'PrgetChatroomMembersoject') {



        // } else {


        let isInit = true;
        ChatService.getChatroomMsg(contactData, this.props.extraData.ContactData.chatroomUid).
            then(function (messages) {
                console.log(messages)

                for (let index in messages) {
                    self.addMsgToRoom(messages[index]);
                }

                // //Scroll to buttom
                // let room = self.refs.roomView;
                // room.scrollTop = room.scrollHeight;
            }).then(() => {
                
                if (this.props.extraData.ContactData.type == "Project") {
                    ChatService.getChatroomMembers(this.props.extraData.ContactData.chatroomUid).then(function (memData) {
                        self.setState(self.state.members = [])
                        for (let i = 0; i < memData.length; i++) {
                            self.state.members.push({ value: memData[i], label: memData[i] })
                        }
                        self.setState(self.state)
                    })
                }

            })
            .then(() => {
                ChatService.listenChatRoomChange(this.props.extraData.ContactData.chatroomUid).on('child_added', function (data) {
                    console.log('Listen msg changing:');
                    console.log(data.val());
                    // console.log(data.val().senderUid);
                    // console.log(data.key);

                    if (self.state.messages.length == 0 &&
                        UserService.getCurrentUser().uid != data.val().senderUid) {
                        self.addMsgToRoom(data.val())
                        ChatService.updateHistory(self.props.extraData.ContactData.chatroomUid, data.val().content)
                    } else if (isInit == false && UserService.getCurrentUser().uid != data.val().senderUid) {
                        self.addMsgToRoom(data.val())
                        ChatService.updateHistory(self.props.extraData.ContactData.chatroomUid, data.val().content)
                    }
                    if (isInit) {
                        isInit = false;
                    }

                    //console.log(data.val());
                    //return resolve(data.val());
                })
            }).catch(function (err) {
                alert("Error occur" + err)
            })
    }

    addMsgToRoom(msgData) {
        let prevState = this.state
        let recipient;
        let msg = msgData.content
        if (ChatService.checkSenderIsCurrentUser(msgData.senderUid) == false &&
            this.props.extraData.ContactData.type == "Project") {
            msg = msgData.senderName + ":" + msgData.content
            recipient = msgData.senderUid
        } else if (ChatService.checkSenderIsCurrentUser(msgData.senderUid) == false) {
            recipient = msgData.senderUid;
        } else {
            recipient = 0;
        }
        // else {
        //     recipient = "uuidtest"
        //     //TODO, if it is project, need to add name
        //     //msg = msgData.senderName+":"+ msgData.content
        // }

        
        console.log(msgData.senderUid)
        prevState.messages.push(new Message({ id: recipient, message: msg }));
        this.setState(this.state)

        
        //Scroll to buttom
        let room = this.refs.roomView;
        if(room != undefined){
             room.scrollTop = room.scrollHeight;
        }
    }

    _onPress(user) {
        console.log("onPress: ", { user });
        this.setState({ curr_user: user });
    }

    _pushMessage(recipient, message) {
        var prevState = this.state
        prevState.messages.push(new Message({ id: recipient, message: message }));
        this.setState(this.state)

        //Scroll to buttom
        let room = this.refs.roomView;
        room.scrollTop = room.scrollHeight;
    }

    _onMessageSubmit(e) {
        var input = this.refs.message;
        e.preventDefault();
        if (!input.value) { return false; }
        let self = this;
        ChatService.pushMsg(input.value, this.props.extraData.ContactData.chatroomUid).then(function () {
            self._pushMessage(self.state.curr_user, input.value)
            ChatService.updateHistory(self.props.extraData.ContactData.chatroomUid, input.value)
            input.value = '';

        }).catch(function (err) {
            alert("Error:" + err)
        })

    }

    render() {
        //this.componentDidMount()
        console.log('1!!!!!!!!!!!!')
        console.log(this.props.extraData.fromLeftHistory)
        console.log(this.props.extraData.fromLeftHistory == undefined)
        if (this.props.extraData.fromLeftHistory != undefined &&
            this.props.extraData.fromLeftHistory == true) {
            this.props.extraData.fromLeftHistory = false
            // this.setState({
            //     messages: []
            // })
            this.state.messages = []
            this.initialize();
            console.log('INNN')
        }
        return (
            console.log('return render !!!!!'),
            <div>
                <div>
                    <Row>
                        <Col xs={1} md={1} >
                            <Media.Left>
                                <h3>{this.props.extraData.ContactData.name}</h3>
                            </Media.Left>
                            <Media.Right>
                                {this.props.extraData.ContactData.type == "Project" ? chatMemBar(this) : ''}
                            </Media.Right>
                        </Col>
                    </Row>
                </div>
            <div className='chatContainer'>


                <div id="ChatMian" ref='roomView'>
                    <ChatFeed
                        style={{display: 'flex'}}
                        messages={this.state.messages} // Boolean: list of message objects
                        isTyping={this.state.is_typing} // Boolean: is the recipient typing
                        hasInputField={false} // Boolean: use our input, or use your own
                        bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
                        // JSON: Custom bubble styles
                        bubbleStyles={
                            {
                                text: {
                                    fontSize: 15,
                                    color: 'black'
                                },
                                chatbubble: {
                                    borderRadius: 5,
                                    padding: 10,
                                    

                                },
                                userBubble: {
                                    backgroundColor: '#8FC1D4',
                                }

                            }
                        }
                    />
                    
                </div>
                <div id="ChatInput">
                    <form id="typeMessage" onSubmit={this._onMessageSubmit.bind(this)}>
                        <input type="chatInput" ref="message" placeholder="Type a message..." className="message-input" />
                    </form>
                </div>
            </div>
</div>
        )
    }

}


export default ChatRoom;
// const mapStateToProps = (state) => {
//     console.log("mapStateToProps", state.default[0])
//     return {
//         switchName: state.default[0]
//     }
// };

//export default connect(mapStateToProps, null)(ChatRoom);
