sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function(Controller, History, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("ns.books.controller.Detail", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

            // rating model
            this.oRatingModel = new JSONModel({
                rating: 0
            });
            this.getView().setModel(this.oRatingModel, "rating");
        },

        _onObjectMatched: function (oEvent) {
            var sBookID = oEvent.getParameter("arguments").bookID;

            // Reset rating to 0 when a new book is selected
            this.oRatingModel.setProperty("/rating", 0);

            
            this.getView().bindElement({
                path: "/Books(" + sBookID + ")",
                parameters: { expand: "author,genre" }
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteBooklist", {}, true);
            }
        },

        onRatingChange: function (oEvent) {
            var fValue = oEvent.getParameter("value");
            this.oRatingModel.setProperty("/rating", fValue); // To update the rating model

            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var sMessage = oResourceBundle 
                ? oResourceBundle.getText("ratingConfirmation", [fValue])
                : "Rating: " + fValue;

            MessageToast.show(sMessage);
        }
    });
});
