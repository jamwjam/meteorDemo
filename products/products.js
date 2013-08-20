if (Meteor.isClient) {
  var Products = new Array(
        { Name    :  "Screw Driver",
          Price   :  "1.50",
          InStock :  true },
           
        { Name    :  "Hammer",
          Price   :  "3.00",
          InStock :  false }
  );
   
  Template.Products.ProductArr = function(){
     return Products;
  };
  Template.Products.events = {
    "click .Product" : function(){
      if(this.InStock)
        confirm("Would you like to buy a " + this.Name + " for " + this.Price + "?");
      else
        alert("That item is not in stock");
    }
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
