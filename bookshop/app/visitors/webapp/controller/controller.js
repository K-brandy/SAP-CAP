sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Button",
    "sap/m/MessageToast"
], function(Controller, Button, MessageToast) {
    "use strict";

    return Controller.extend("namespace.controller.ListReport", {
        
        onInit: function() {
            // Dynamically create and place the button
            var oButton = new Button({
                text: "My Custom Button",
                press: this.onCustomButtonPress.bind(this)
            });
            this.getView().byId("myToolbar").addContent(oButton); // Assuming 'myToolbar' is the ID of the toolbar
        },

        onCustomButtonPress: function() {
            MessageToast.show("Button Pressed!");
        }

    });
});
