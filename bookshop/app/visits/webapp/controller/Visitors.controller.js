sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("ns.visits.controller.Visitors", {
        onInit: function () {
            this.getView().setModel(this.getOwnerComponent().getModel());
        },
        onNavToVisits: function() {
            this.getOwnerComponent().getRouter().navTo("visits");
        },
        
    });
});
