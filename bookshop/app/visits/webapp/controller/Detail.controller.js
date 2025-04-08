
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox"

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
                rowCount: 0,
                isDeleteEnabled: false,
            });
            this.getView().setModel(oViewModel, "view");

            const oAgendaDataModel = new JSONModel({
                agendaData: [
                    {
                        visitorID: "1", topic: "Networking", description: "Business discussions", outcome: "Successful", visitors: [
                            { ID: "1", name: "Alice Johnson" },
                            { ID: "2", name: "Takeshi Yamamoto" }
                        ]
                    },
                    {
                        visitorID: "3", topic: "Project kickoff", description: "Introduction to new project", outcome: "In Progress", visitors: [
                            { ID: "3", name: "Tom Harris" },
                            { ID: "4", name: "Arjun Mehta" }
                        ]
                    },
                    {
                        visitorID: "1", topic: "Budget Review", description: "Discuss financials for Q2", outcome: "Approved", visitors: [
                            { ID: "1", name: "Rajesh Kumar" },
                            { ID: "3", name: "Emily Clark" }
                        ]
                    },
                    {
                        visitorID: "2", topic: "Team Building", description: "Plan activities for collaboration", outcome: "Scheduled", visitors: [
                            { ID: "1", name: "Alice Johnson" },
                            { ID: "2", name: "Takeshi Yamamoto" }
                        ]
                    },
                    {
                        visitorID: "3", topic: "Tech Update", description: "Review latest technology trends", outcome: "Action Items Assigned", visitors: [
                            { ID: "3", name: "Tom Harris" },
                            { ID: "4", name: "Arjun Mehta" }
                        ]
                    },
                    {
                        visitorID: "2", topic: "Customer Feedback", description: "Analyze user survey results", outcome: "Enhancements Planned", visitors: [
                            { ID: "1", name: "Rajesh Kumar" },
                            { ID: "2", name: "Takeshi Yamamoto" }
                        ]
                    }
                ]
            });
            this.getView().setModel(oAgendaDataModel, "agenda");



            const oAgendaTopic = new JSONModel({
                agendaTopics: [
                    { key: "Networking", text: "Networking" },
                    { key: "Project kickoff", text: "Project Kickoff" },
                    { key: "Budget Review", text: "Budget Review" },
                    { key: "Team Building", text: "Team Building" },
                    { key: "Tech Update", text: "Tech Update" },
                    { key: "Customer Feedback", text: "Customer Feedback" },
                ]
            });

            this.getView().setModel(oAgendaTopic, "topics")
        },

        onEdit: function () {
            const oTable = this.getView().byId("idAgendaTable");

            // Loop through each row and enable editing for Input fields
            oTable.getItems().forEach((oItem) => {
                oItem.getCells().forEach((oCell) => {
                    if (oCell instanceof sap.m.Input || oCell instanceof sap.m.ComboBox) {
                        oCell.setEditable(true);
                    }
                });
            });

            // Show Save & Cancel buttons, hide Edit
            this.getView().byId("editButton").setVisible(false);
            this.getView().byId("saveButton").setVisible(true);
            this.getView().byId("cancelButton").setVisible(true);
        },
        onAdd: function () {
            var oAgendaModel = this.getView().getModel("agenda");

            var aAgendaData = oAgendaModel.getProperty("/agendaData") || [];

            // new row
            var oNewAgendaItem = {
                visitorID: "",
                topic: "",
                description: "",
                outcome: "",
                visitors: [
                    { ID: "1", name: "Alice Johnson" },
                    { ID: "2", name: "Takeshi Yamamoto" },
                    { ID: "3", name: "Tom Harris" },
                    { ID: "4", name: "Arjun Mehta" }
                ]
            };

            aAgendaData.push(oNewAgendaItem);

            oAgendaModel.setProperty("/agendaData", aAgendaData);
            oAgendaModel.refresh();
        },


        onSave: function () {
            var oModel = this.getView().getModel(); // Get OData model
            var oAgendaModel = this.getView().getModel("agenda");
            var aAgendaData = oAgendaModel.getProperty("/agendaData");

            var oListBinding = oModel.bindList("/Agenda");

            aAgendaData.forEach(function (oItem) {
                if (!oItem.ID) {
                    oListBinding.create(oItem);
                }
            });

            oModel.submitBatch("batchGroup"); // batch processing
            sap.m.MessageToast.show("Agenda saved successfully!");

            this.getView().byId("editButton").setVisible(true);
            this.getView().byId("saveButton").setVisible(false);
            this.getView().byId("cancelButton").setVisible(false);
        },
        onCancel: function () {
            const oTable = this.getView().byId("idAgendaTable");


            oTable.getItems().forEach((oItem) => {
                oItem.getCells().forEach((oCell) => {
                    if (oCell instanceof sap.m.Input || oCell instanceof sap.m.ComboBox) {
                        oCell.setEditable(false);
                    }
                });
            });

            this.getView().byId("editButton").setVisible(true);
            this.getView().byId("saveButton").setVisible(false);
            this.getView().byId("cancelButton").setVisible(false);
        },
        onSelectionChange: function (oEvent) {
            var oTable = this.byId("idAgendaTable");
            var oModel = this.getView().getModel("view"); // Getting model by name
            if (oModel) {
                var bSelected = oTable.getSelectedItem() !== null;
                oModel.setProperty("/isDeleteEnabled", bSelected); // Update 
            } else {
                console.error("Model 'view' is not defined");
            }
        },

        onDelete: function () {
            var oTable = this.byId("idAgendaTable");
            var oSelectedItems = oTable.getSelectedItems();
            var msg;
            if (oSelectedItems.length === 0) {
                msg = "Please select atleast one row";
                MessageBox.show(msg, {
                    icon: MessageBox.Icon.ERROR,
                    title: "Error"
                });
            } else {
                oSelectedItems.forEach(function (oItem) {
                    oTable.removeItem(oItem); // Proper way to remove items
                });
                this.onRefresh();
            }
        },

        onRefresh: function () {
            var oTable = this.getView().byId("idAgendaTable");
            var aItems = oTable.getItems();

            aItems.forEach(function (oItem, index) {
                var text = (index + 1) * 10;
                var oFirstCell = oItem.getCells()[0]; // Get the first cell

                // Check the control type and update accordingly
                if (oFirstCell.isA("sap.m.Text")) {
                    oFirstCell.setText(text);
                } else if (oFirstCell.isA("sap.m.Input")) {
                    oFirstCell.setValue(text);
                } else if (oFirstCell.isA("sap.m.ComboBox")) {
                    oFirstCell.setSelectedKey(text.toString()); // Ensure it's a string
                }
            });
        },

        // onCancel: function () {
        //     const oTable = this.getView().byId("idAgendaTable");


        //     oTable.getItems().forEach((oItem) => {
        //         oItem.getCells().forEach((oCell) => {
        //             if (oCell instanceof sap.m.Input || oCell instanceof sap.m.ComboBox) {
        //                 oCell.setEditable(false);
        //             }
        //         });
        //     });


        //     this.getView().byId("editButton").setVisible(true);
        //     this.getView().byId("saveButton").setVisible(false);
        //     this.getView().byId("cancelButton").setVisible(false);
        // },
        /* onAdd: function () {
            console.log("Add Row button clicked");


            var oModel = this.getView().getModel();

            var oTable = this.getView().byId("idAgendaTable");
            var oBinding = oTable.getBinding("items");

            var oNewAgendaItem = {
                visitorID: "",
                topic: "",
                description: "",
                outcome: "",
                visitors: [
                    { ID: "1", name: "Alice Johnson" },
                    { ID: "2", name: "Takeshi Yamamoto" },
                    { ID: "3", name: "Tom Harris" },
                    { ID: "4", name: "Arjun Mehta" }
                ]
            };

            // Create a new context for the new row
            var oContext = oBinding.create({
                visitorID: oNewAgendaItem.visitorID,
                topic: oNewAgendaItem.topic,
                description: oNewAgendaItem.description,
                outcome: oNewAgendaItem.outcome,
                visitors: oNewAgendaItem.visitors
            });

            oContext.created().then(function () {
                sap.m.MessageToast.show("Agenda item added successfully");
            }).catch(function (oError) {
                sap.m.MessageToast.show("Failed to add agenda item: " + oError.message);
            });
        }, */



        // onDelete: function (oEvent) {
        //     // Get the button that was clicked
        //     var oButton = oEvent.getSource();
        //     var oItem = oButton.getParent();
        //     var oBindingContext = oItem.getBindingContext();
        //     if (oBindingContext) {
        //         var oModel = oBindingContext.getModel();

        //         var sPath = oBindingContext.getPath();
        //         oModel.remove(sPath, {
        //             success: function () {
        //                 sap.m.MessageToast.show("Row deleted successfully");
        //             },
        //             error: function (oError) {
        //                 sap.m.MessageToast.show("Failed to delete row: " + oError.message);
        //             }
        //         });
        //     } else {
        //         var oTable = this.getView().byId("idAgendaTable");
        //         oTable.removeItem(oItem);
        //         sap.m.MessageToast.show("Row removed from UI");
        //     }
        // },


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
            var sVisitID = oEvent.getParameter("arguments").visitID;

            // Reset rating to 0 when a new book is selected
            this.oRatingModel.setProperty("/rating", 0);

            // Bind the Books entity and expand
            this.getView().bindElement({
                path: "/Visits(" + sVisitID + ")",
                parameters: { expand: "visitors/visitor,location,status,spaces,feedback" }
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
        onSendFB: function () {
            var oView = this.getView();
            var oModel = this.getView().getModel();
            
            var sFeedback = oView.byId("feedbackId").getValue();
            var iRating = this.getView().getModel("rating").getProperty("/rating");
            var iVisitID = oView.getBindingContext().getProperty("ID");
            if (!sFeedback) {
                MessageToast.show("Please provide feedback.");
                return;
            }
            
            var oNewFeedback = {
                feedback: sFeedback,
                rating: iRating,
                visitID: iVisitID
            };
            
            var oListBinding = oModel.bindList("/Feedback");
            oListBinding.create(oNewFeedback);
            
            oModel.submitBatch("FeedbackGroup").then(function () {
                
                MessageToast.show("Feedback sent successfully.");
                oView.byId("feedbackId").setValue("");
                oView.getModel("rating").setProperty("/rating", 0);
                oView.byId("idRatingRatingIndicator").setValue(0);
                oModel.refresh();
            }).catch(function (oError) {
                MessageToast.show("Error sending feedback.");
                console.error(oError);
            });
        }
        
        ,

        // search field for visitors
        onSearchVisitor: function (oEvent) {
            const sQuery = oEvent.getParameter("query");
            const aFilters = [];

            if (sQuery) {
                const filters = [];

                // Apply ID filter only if sQuery is a number
                if (!isNaN(parseInt(sQuery))) {
                    filters.push(new Filter("visitor/ID", FilterOperator.EQ, sQuery));
                    
                }

                // String filters
                filters.push(
                  
                    new Filter("visitor/name", FilterOperator.Contains, sQuery),
                    new Filter("visitor/email", FilterOperator.Contains, sQuery),
                    new Filter("visitor/country", FilterOperator.Contains, sQuery),
                    new Filter("visitor/street", FilterOperator.Contains, sQuery),
                    new Filter("visitor/postal_code", FilterOperator.Contains, sQuery),
                    new Filter("visitor/company", FilterOperator.Contains, sQuery),
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

                    console.log(field.property + ":" + value);

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
        _onRouteMatched: function (oEvent) {
            var sVisitID = oEvent.getParameter("arguments").visitID;
            console.log("Navigated to visit ID:", sVisitID);

            if (sVisitID) {
                var oModel = this.getView().getModel();
                var sPath = "/Visits(" + sVisitID + ")";

                this.getView().bindElement({
                    path: sPath,
                    parameters: { expand: "relatedData" },
                    events: {
                        dataReceived: function (oData) {
                            console.log("Detail View Data Loaded:", oData);
                        }
                    }
                });
            }
        },


        onDateChange: function (oEvent) {

            var sSelectedDate = oEvent.getParameter("value");
            console.log("Selected Date: " + sSelectedDate);
        }
        ,

        onLocationSelectionChange: function (oEvent) {
            var oComboBox = this.byId("idSpaceComboBox");
            var sSelectedLocationID = oEvent.getParameter("selectedItem")?.getKey();

            if (sSelectedLocationID) {
                var oBinding = oComboBox.getBinding("items");
                var oFilter = new Filter("locationID", FilterOperator.EQ, sSelectedLocationID);

                oBinding.filter([oFilter]);

                // Check matching items
                oBinding.attachEventOnce("change", function (oChangeEvent) {
                    var aFilteredItems = oChangeEvent.getSource().getCurrentContexts();

                    if (aFilteredItems.length === 0) {
                        MessageBox.error("No spaces are available for the selected location. Please update the space data or choose another location.");
                        oComboBox.setEnabled(false);
                    } else {
                        oComboBox.setEnabled(true);
                    }
                });

            } else {
                oComboBox.getBinding("items").filter([]);
                oComboBox.setEnabled(true);
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

            let visitorID = aSelectedItem.getBindingContext().getObject().ID;
            let visitId = oBookContext.getObject().ID;
            console.log(visitorID);
            console.log(visitId);
            //debugger;

            //v4 functionImport
            var oActionODataContextBinding = oModel.bindContext("/assignVisitorToVisit(...)");
            oActionODataContextBinding.setParameter("visitId", visitId)
            oActionODataContextBinding.setParameter("visitorID", visitorID)



            oActionODataContextBinding.execute().then(
                function () {
                    oModel.refresh();
                    MessageBox.success("Visitor successfully assigned to the Book.");
                    // Refresh the Visitors list to reflect the change immediately
                    
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