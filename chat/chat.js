Messages = new Meteor.Collection('messages');
User = new Meteor.Collection('users');

  if (Meteor.isClient) {
  Meteor.startup(function () {
    var userName = prompt("Enter your name : ", "your name here");
    Meteor.call("create_user", userName, function(error, user_id){
      Session.set("user_id", user_id);
    });                               
  });

  Session.set("current_channel", "cool_people_channel");
  Meteor.autorun(function(){
    Meteor.subscribe("messages", Session.get("current_channel"));
  });

  ////////// Helpers for in-place editing //////////
  // Returns an event_map key for attaching "ok/cancel" events to
  // a text input (given by selector)
  var okcancel_events = function (selector) {
    return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
  };
  
  // Creates an event handler for interpreting "escape", "return", and "blur"
  // on a text field and calling "ok" or "cancel" callbacks.
  var make_okcancel_handler = function (options) {
    var ok = options.ok || function () {};
    var cancel = options.cancel || function () {};
  
    return function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);
      } else if (evt.type === "keyup" && evt.which === 13) {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };
  };

  if(Meteor.isServer) {
    Meteor.publish("messages", function(channel_name) {
        return Messages.find({channel: channel_name});
    });
    Meteor.methods({
        create_user: function(username) {
            console.log("CREATING dUSER");
            var USER_id = Users.insert({name: username});
            return user_id;
        },
    });
  }


  Template.entry.events = {};

  Template.entry.events[okcancel_events('#messageBox')] = make_okcancel_handler({ok: function(text, event){
    var nameEntry = document.getElementById('name');
    if(nameEntry.value != ""){
      var ts = Date.now() / 1000;
      Messages.insert({name:nameEntry.value, message: text, time:ts});
      event.target.value = "";
    }
  }});

  Template.messages.messages = function(){
    return Messages.find({}, {sort: {time: -1}});
  };
  Template.cool_dude.username = function(){
    return Session.get("user_id");
  }
};
