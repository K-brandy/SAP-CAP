sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox",
], function (Controller, History, MessageToast, JSONModel, Filter, FilterOperator, Fragment, MessageBox) {
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

            // view model
            const oViewModel = new JSONModel({
                isEditable: false,
                rowCount: 0
            });
            this.getView().setModel(oViewModel, "view");
        },

        updateRowCount: function (oTable) {
            var oTable = this.byId("idBusinessPartnersTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                var iCount = oBinding ? oBinding.getLength() : 0;
                oTable.setHeaderText("Total Business Partners: " + iCount);
                this.getView().getModel("view").setProperty("/rowCount", iCount);
            }
        },

        onBeforeRendering: function () {
            var oTable = this.byId("idBusinessPartnersTable");

            // Ensure row count is updated before rendering
            this.updateRowCount(oTable);

            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.attachChange(function () {
                    this.updateRowCount(oTable);
                }.bind(this));
            }
        },

        _onObjectMatched: function (oEvent) {
            var sBookID = oEvent.getParameter("arguments").bookID;

            // Reset rating to 0 when a new book is selected
            this.oRatingModel.setProperty("/rating", 0);

            // Bind the Books entity and expand
            this.getView().bindElement({
                path: "/Books(" + sBookID + ")",
                parameters: { expand: "author,genre,businessPartners" }
            });
        },

        onPageNavButtonPress: function () {
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
        },

        // search field for business partners
        onSearchFieldBPSearch: function (oEvent) {
            const sQuery = oEvent.getParameter("query");
            const aFilters = [];

            if (sQuery) {
                const filters = [];

                // Apply ID filter only if sQuery is a number
                if (!isNaN(parseInt(sQuery))) {
                    filters.push(new Filter("ID", FilterOperator.EQ, sQuery));
                }

                // String filters
                filters.push(
                    new Filter("name", FilterOperator.Contains, sQuery),
                    new Filter("country", FilterOperator.Contains, sQuery),
                    new Filter("street", FilterOperator.Contains, sQuery),
                    new Filter("postal_code", FilterOperator.Contains, sQuery)
                );

                // Combine filters using OR condition
                aFilters.push(new Filter({
                    filters: filters,
                    and: false
                }));
            }
            const oTable = this.byId("idBusinessPartnersTable");
            const oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.filter(aFilters);  // Apply the filters to the table
            }
        },

        onIsEditableButtonPress() {
            const oViewModel = this.getView().getModel("view");
            const pageIsEditable = oViewModel.getProperty("/isEditable");

            // Toggle `isEditable` state
            oViewModel.setProperty("/isEditable", !pageIsEditable);
        },

        formatToggleButtonText(isEditable) {
            return isEditable ? "Read" : "Edit";
        },

        onSaveButtonPress: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
            var oContext = oView.getBindingContext();

            // Define the fields and their corresponding input IDs
            var fields = [
                { property: "title", inputId: "idTitleInput" },
                { property: "descr", inputId: "idDescrInput" },
                { property: "author", inputId: "idAuthorInput" },
                { property: "genre", inputId: "idGenreInput" },
                { property: "price", inputId: "idPriceInput", transform: value => value.replace(",", ".") },
                { property: "currency_code", inputId: "idCurrencyCodeInput" },
                { property: "stock", inputId: "idStockInput", transform: value => parseInt(value, 10) || 0 }
            ];

            // Iterate over fields to update properties
            fields.forEach(function (field) {
                var value = oView.byId(field.inputId).getValue();
                if (field.transform) {
                    value = field.transform(value);
                }
                oContext.setProperty(field.property, value);
            });

            // Submit the batch request
            oModel.submitBatch("BooksBatchGroup")
                .then(function () {
                    MessageToast.show("Book details saved successfully!");
                })
                .catch(function (oError) {
                    MessageToast.show("Error saving book details: " + oError.message);
                });
        },

        onButtonButtonPress: function (oEvent) {
            var oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "ns.books.view.fragment.dialog", // Make sure this path is correct
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog; // Return the dialog object
                });
            }

            // Ensure the dialog opens after the promise resolves
            this._pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onBusinessPartnersSelectDialogConfirm: async function (oEvent) {
            const oView = this.getView();
            const oBookContext = oView.getBindingContext();
            const oModel = oView.getModel();
            
           //
           //  let sBookID = oBookContext.getObject().ID;
            
            // Assuming you've already gotten the selected Business Partner from the dialog
            let aSelectedItem = oEvent.getParameter("selectedItem");
            let bpID = aSelectedItem.getBindingContext().getObject().ID;
               
            var oObject = aSelectedItem.getBindingContext().getObject();
            console.log("Bound Object:", oObject);
            console.log(aSelectedItem.getBindingContext().getPath());

            //debugger;

       
            // Prepare Payload for Business Partner
            let oPayload = { ID: bpID };
        
            // Add Business Partner to the Book using create() method for the association
            let oBookPath = oBookContext.getPath();
            let oBPBinding = oModel.bindList(oBookPath + "/businessPartners");
        
            oBPBinding.create(oPayload); // Add the new business partner to the list
        
            // Submit the changes
            oModel.submitBatch("myBatchGroupId").then(() => {
                MessageToast.show("Business Partner added successfully!");
            }).catch((oError) => {
                MessageBox.error("Failed to assign Business Partner: " + oError.message);
            });
        },
        
        

        onSelectDialogCancel: function (oEvent) {
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
                MessageToast.show("You have chosen " + aContexts.map(function (oContext) { return oContext.getObject().Name; }).join(", "));
            } else {
                MessageToast.show("No new item was selected.");
            }
            oEvent.getSource().getBinding("items").filter([]);
        },

        onSelectDialogSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("name", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },
    });
});
