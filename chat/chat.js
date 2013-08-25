Messages = new Meteor.Collection('messages');

if (Meteor.isClient) {
  Meteor.startup(function() {
    var username = window.prompt("Input your identity","Enter your name here");
    Session.set("username", username);
  });

  Template.messages.messages = function(){
    return Messages.find({}, {sort:{time:-1}});
  }

  Template.hello.greeting = function () {
    return Session.get("username"); 
  };

  //Template message input event handler
  Template.input.events = {
    'keydown input#message' : function (event) {
      if (event.which == 13) { // 13 is the enter key event
       
        var name =  Session.get("username");
        var message = document.getElementById('message');

        if (message.value != '') {
          Messages.insert({name: name, message: message.value, time: Date.now(),});

          document.getElementById('message').value = '';
          message.value = '';
        }
      }
    }
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
