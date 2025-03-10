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

    return Controller.extend("ns.visits.controller.Detail", {
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
            var oTable = this.byId("idVisitorsTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                var iCount = oBinding ? oBinding.getLength() : 0;
                oTable.setHeaderText("Total Visitors: " + iCount);
                this.getView().getModel("view").setProperty("/rowCount", iCount);
            }
        },

        onBeforeRendering: function () {
            var oTable = this.byId("idVisitorsTable");

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
            var sVisitID = oEvent.getParameter("arguments").bookID;

            // Reset rating to 0 when a new book is selected
            this.oRatingModel.setProperty("/rating", 0);

            // Bind the Books entity and expand
            this.getView().bindElement({
                path: "/Visits(" + sVisitID + ")",
                parameters: { expand: "visitors,location,status,spaces" }
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

        // search field for visitors
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
            const oTable = this.byId("idVisitorsTable");
            const oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.filter(aFilters);
                // Apply the filters to the table
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

                { property: "visitDate", inputId: "idVisitDateDatePicker" },

                { property: "statusID", inputId: "idStatusComboBox" },

                { property: "contact", inputId: "idContactInput" },

                { property: "purpose", inputId: "idPurposeInput" },

                 { property: "locationID", inputId: "idLocationComboBox" },
                 { property: "spaceID", inputId: "idSpaceComboBox" }

            ];

            //  update properties

            fields.forEach(function (field) {
                var oControl = oView.byId(field.inputId);
            
                if (oControl) {
                    var value;

                    if (oControl.isA("sap.m.ComboBox")) {
                        value = oControl.getSelectedKey(); // for ComboBox
                        console.log(value);
                    } else if (oControl.isA("sap.m.DatePicker")) {
                        value = oControl.getDateValue(); //  for DatePicker
                    } else {
                        value = oControl.getValue(); //for Input fields
                    }
            
                    console.log(field.property  + ":" + value);
            
                    if (value !== undefined) {
                        oContext.setProperty(field.property, value);
                    }
                } else {
                    console.warn("Control with ID " + field.inputId + " not found.");
                }
            });
            





            // Submit the batch request
            oModel.submitBatch("VisitsBatchGroup")
                .then(function () {
                    MessageToast.show("Visit details saved successfully!");
                })
                .catch(function (oError) {
                    MessageToast.show("Error saving visit details: " + oError.message);
                });



            // Submit the batch request

            oModel.submitBatch("VisitsBatchGroup")

                .then(function () {

                    MessageToast.show("Visit details saved successfully!");

                })

                .catch(function (oError) {

                    MessageToast.show("Error saving visit details: " + oError.message);

                });

        },

        onDateChange: function (oEvent) {

            var sSelectedDate = oEvent.getParameter("value");
            console.log("Selected Date: " + sSelectedDate);
        }
        ,

        onLocationSelectionChange: function (oEvent) { 
            var oComboBox = this.byId("idSpaceComboBox");
            var sSelectedLocationID = oEvent.getParameter("selectedItem").getKey();
            
            if (sSelectedLocationID) {
                var oBinding = oComboBox.getBinding("items");
                var oFilter = new Filter("locationID", FilterOperator.EQ, sSelectedLocationID);
        
                oBinding.filter([oFilter]);
            } else {
         //clear if nothing is selected
                oComboBox.getBinding("items").filter([]);
            }
        }
        ,
        
        onButtonButtonPress: function (oEvent) {
            var oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "ns.visits.view.fragment.dialog", // Make sure this path is correct
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


        // Example function to call when the user confirms in the dialog: onVisitorsDialogConfirm
        onVisitorsSelectDialogConfirm: async function (oEvent) {
            const oView = this.getView();
            const oModel = oView.getModel();
            const oBookContext = oView.getBindingContext();

            if (!oBookContext) {
                MessageBox.error("No book selected!");
                return;
            }

            let aSelectedItem = oEvent.getParameter("selectedItem");
            if (!aSelectedItem) {
                MessageBox.error("No Visitors selected!");
                return;
            }

            let bpID = aSelectedItem.getBindingContext().getObject().ID;
            let bookID = oBookContext.getObject().ID;
            console.log(bpID);
            console.log(bookID);
            //debugger;

            //v4 functionImport
            var oActionODataContextBinding = oModel.bindContext("/assignVisitorToVisit(...)");
            oActionODataContextBinding.setParameter("visitID", visitID)
            oActionODataContextBinding.setParameter("visitorID", visitorID)



            oActionODataContextBinding.execute().then(
                function () {
                    MessageBox.success("Visitor successfully assigned to the Book.");
                    // Refresh the Visitors list to reflect the change immediately
                    oModel.refresh();
                }.bind(this),
                function (oError) {
                    MessageBox.error("Error assigning Visitors: ");
                }.bind(this)
            );

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
