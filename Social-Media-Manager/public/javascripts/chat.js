$(function(){
  var socket = io.connect('http://localhost:3000');

  var message = $("#message")
  var username = $("#username")
  var send_message = $("#send_message")
  var chatroom = $("#chatroom")

  send_message.click(function(){
    socket.emit('new_message', {message: message.val(), username: username.val()})

  })

  socket.on("new_message", (data) => {
    console.log(data)
    if(data.username === username.val())
      chatroom.append("<div class ='message'><p class= 'my-message'>" + data.message + "</p> <span>"+ data.username +"</span></div>")
    else {
      chatroom.append("<div class ='message'><p class= 'other-message'>" + data.message + "</p> <span>"+ data.username +"</span></div>")
    }
  })
});
