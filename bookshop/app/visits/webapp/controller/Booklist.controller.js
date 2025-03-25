sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox"

], (Controller, JSONModel, Filter, FilterOperator, Fragment, MessageBox) => {
    "use strict";

    return Controller.extend("ns.visits.controller.Booklist", {
        onInit: function () {


            // Initialize view model (for row count or other purposes)
            var oViewModel = new JSONModel({
                rowCount: 0
            });
            this.getView().setModel(oViewModel, "view");
        },

        onAfterRendering: function () {
            // Ensure the filter is applied once the table has been rendered
            const oTable = this.byId("idVisitsTable");
            const oBinding = oTable.getBinding("items");

            if (oBinding) {
                const aContexts = oBinding.getContexts();
                if (aContexts && aContexts.length === 0) {
                    this._applyStatusFilter("All");
                }
            }
        },



        onSearchFieldSearch: function (oEvent) {
            const sQuery = oEvent.getParameter("query");
            const aFilters = [];


            if (sQuery) {
                const filters = [];

                // Check if the query is a number
                if (!isNaN(parseInt(sQuery))) {
                    filters.push(new Filter("ID", FilterOperator.EQ, sQuery));
                    filters.push(new Filter("contact", FilterOperator.EQ, sQuery));

                }

                // String-based filters
                filters.push(
                    new Filter("locationName", FilterOperator.Contains, sQuery),
                    new Filter("purpose", FilterOperator.Contains, sQuery),
                    new Filter("statusName", FilterOperator.Contains, sQuery)
                );

                // Combine filters using OR condition
                aFilters.push(new Filter({
                    filters: filters,
                    and: false
                }));
            }

            // Bind the filters to the table
            const oTable = this.byId("idVisitsTable");
            const oBinding = oTable.getBinding("items");

            if (oBinding) {
                if (!sQuery) {
                    oBinding.filter([]); // Clear filters if search is empty
                } else {
                    oBinding.filter(aFilters);  // Apply the filters to the table
                }
            }
        },


        onColumnListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var sPath = oItem.getBindingContext().getPath();
            var sVisitID = sPath.split("(")[1].split(")")[0];

            oRouter.navTo("detail", { visitID: sVisitID });

        },

        updateRowCount: function (oTable) {
            var oTable = this.byId("idVisitsTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                var iCount = oBinding ? oBinding.getLength() : 0;
                oTable.setHeaderText("Total Visits: " + iCount);
                this.getView().getModel("view").setProperty("/rowCount", iCount);

            }
        },

        onBeforeRendering: function () {
            var oTable = this.byId("idVisitsTable");

            // Ensure row count is updated before rendering
            this.updateRowCount(oTable);

            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.attachChange(function () {
                    this.updateRowCount(oTable);
                }.bind(this));
            }
        },
        onIconTabBarSelect: function (oEvent) {
            const sKey = oEvent.getParameter("key");
            this._applyStatusFilter(sKey);
        },

        _applyStatusFilter: function (sStatus) {
            const oTable = this.byId("idVisitsTable");
            const oBinding = oTable.getBinding("items");

            if (oBinding) {
                if (sStatus === "Completed") {
                    const oFilter = new Filter("statusName", FilterOperator.EQ, "Completed");
                    oBinding.filter([oFilter]);
                } else {
                    oBinding.filter([]); // Clear filter for other tabs
                }
            } else {
                console.warn("Binding not ready");
            }
        },

        _getSelectedStatus: function () {
            const oIconTabBar = this.byId("idIconTabBar");
            const selectedKey = oIconTabBar.getSelectedKey();

            //     // Return 'Completed' or clear the filter
            return selectedKey === "Completed" ? "Completed" : "";
        },

        onCreateVisitPress: function () {
            if (!this._oCreateVisitFragment) {
                Fragment.load({
                    name: "ns.visits.view.fragment.visitForm",
                    id: this.getView().getId(),
                    controller: this
                }).then(function (oFragment) {
                    this._oCreateVisitFragment = oFragment;
                    this.getView().addDependent(this._oCreateVisitFragment);
                    this._oCreateVisitFragment.open();
                }.bind(this)).catch(function (oError) {
                    MessageBox.error("Failed to load fragment: " + oError.message);
                });
            } else {
                this._oCreateVisitFragment.open();
            }
        },
        onCreateVisit: function () {
            var oFragmentId = this.getView().getId();
            var oListBinding = this.getView().byId("idVisitsTable").getBinding("items");
            var sVisitID = Fragment.byId(oFragmentId, "id").getValue();
            var sVisitDate = Fragment.byId(oFragmentId, "visitDate").getValue();
            var sStatusID = Fragment.byId(oFragmentId, "status").getSelectedKey();
            var sContact = Fragment.byId(oFragmentId, "contact").getValue();
            var sPurpose = Fragment.byId(oFragmentId, "purpose").getValue();
            var sLocationID = Fragment.byId(oFragmentId, "location").getSelectedKey();
            var sDescription = Fragment.byId(oFragmentId, "description").getValue();
            var sSpaceID = Fragment.byId(oFragmentId, "spaces").getSelectedKey();

            if (!sVisitID || !sVisitDate || !sStatusID || !sContact || !sPurpose || !sLocationID || !sDescription || !sSpaceID) {
                //    MessageBox.error("All fields are required. Please fill in all details before creating a visit");
                var oVisitIDControl = Fragment.byId(oFragmentId, "id");
                var oVisitDateControl = Fragment.byId(oFragmentId, "visitDate");
                var oStatusControl = Fragment.byId(oFragmentId, "status");
                var oContactControl = Fragment.byId(oFragmentId, "contact");
                var oPurposeControl = Fragment.byId(oFragmentId, "purpose");
                var oLocationControl = Fragment.byId(oFragmentId, "location");
                var oDescriptionControl = Fragment.byId(oFragmentId, "description");
                var oSpaceControl = Fragment.byId(oFragmentId, "spaces");

                var bValidationError = false;

                //functn validate a field
                function validateField(oControl, sErrorMessage) {
                    var sValue = oControl.getValue ? oControl.getValue() : oControl.getSelectedKey();
                    if (!sValue) {
                        oControl.setValueState(sap.ui.core.ValueState.Error);
                        oControl.setValueStateText(sErrorMessage);
                        bValidationError = true;
                    } else {
                        oControl.setValueState(sap.ui.core.ValueState.None); // Reset if valid
                    }
                }
                validateField(oVisitIDControl, "Visit ID is required!");
                validateField(oVisitDateControl, "Visit date is required!");
                validateField(oStatusControl, "Status is required!");
                validateField(oContactControl, "Contact is required!");
                validateField(oPurposeControl, "Purpose is required!");
                validateField(oLocationControl, "Location is required!");
                validateField(oDescriptionControl, "Description is required!");
                validateField(oSpaceControl, "Space is required!");

                if (bValidationError) {
                    MessageBox.error("Please fill in all required fields before creating a visit.");
                    return;
                }

                return; // Stop if field is empty
            }

            var oData = {
                ID: sVisitID,
                visitDate: sVisitDate,
                statusID: sStatusID,
                contact: sContact,
                purpose: sPurpose,
                locationID: sLocationID,
                description: sDescription,
                spaceID: sSpaceID
            };
            var oCreatedContext = oListBinding.create(oData);  //context of newly created visit

            oCreatedContext.created().then(() => {
                oCreatedContext.refresh(); //get latest version
                return oCreatedContext.requestObject(); // Ensure latest data is retrvd from bckend
            }).then((oNewVisit) => {
                if (oNewVisit && oNewVisit.ID) {
                    var sVisitID = oNewVisit.ID;

                    console.log(sVisitID);

                    MessageBox.success("Visit created successfully");
                    //debugger;
                    // Close dialog
                    this._oCreateVisitFragment.close();
                    oListBinding.refresh();

                    this.getOwnerComponent().getRouter().navTo("detail", { visitID: sVisitID });

                } else {
                    MessageBox.error("Error: Created visit ID is undefined.");
                }
            }).catch((oError) => {
                console.error("Visit creation failed:", oError);
                MessageBox.error("Error creating visit.");
            });
        },

        onCancelDialog: function () {
            if (this._oCreateVisitFragment) {
                this._oCreateVisitFragment.close();
            }
        },

        onNavToLaunchpad: function () {
            window.location.href = "../../launchpad.html";
        },

        onNavToVisitors: function () {
            this.getOwnerComponent().getRouter().navTo("visitors");
        },

        onNavToAgenda: function () {
            this.getOwnerComponent().getRouter().navTo("agenda");
        },

        onNavToLocations: function () {
            this.getOwnerComponent().getRouter().navTo("locations");
        },

        onNavToSpaces: function () {
            this.getOwnerComponent().getRouter().navTo("spaces");
        },

        onNavToReports: function () {
            this.getOwnerComponent().getRouter().navTo("reports");
        },

        onNavToSettings: function () {
            this.getOwnerComponent().getRouter().navTo("settings");
        },


    });
});