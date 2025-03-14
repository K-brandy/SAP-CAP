sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
], (Controller, JSONModel, Filter, FilterOperator,Fragment) => {
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
            var sBookID = sPath.split("(")[1].split(")")[0];

            oRouter.navTo("detail", { bookID: sBookID });

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

         onCreateVisitPress: function() {
            if (!this._oCreateVisitFragment) { // loads fragment
                Fragment.load({
                    name: "ns.visits.view.fragment.visitForm",
                    id: this.getView().getId(), // Set the fragment ID to the view ID
                    controller: this
                }).then(function(oFragment) {
                    this._oCreateVisitFragment = oFragment;
                    this.getView().addDependent(this._oCreateVisitFragment);
                    this._oCreateVisitFragment.open();
                }.bind(this)).catch(function(oError) {
                    MessageBox.error("Failed to load fragment: " + oError.message);
                });
            } else {
                this._oCreateVisitFragment.open();
            }
        },
        
        onCreateVisit: function() {
            var oFragmentId = this.getView().getId(); // fragment ID
            var oListBinding = this.getView().byId("idVisitsTable").getBinding("items");

            var oData = {
                ID: Fragment.byId(oFragmentId, "id").getValue(),
                visitDate: Fragment.byId(oFragmentId, "visitDate").getValue(),
                statusID: Fragment.byId(oFragmentId, "status").getSelectedKey(),
                contact: Fragment.byId(oFragmentId, "contact").getValue(),
                purpose: Fragment.byId(oFragmentId, "purpose").getValue(),
                locationID: Fragment.byId(oFragmentId, "location").getSelectedKey(),
                description: Fragment.byId(oFragmentId, "description").getValue()
            };

            // Create the new visit entity
            oListBinding.create(oData);

            MessageBox.success("Visit created successfully");
        
          
        },
        onCancelDialog: function() {
            if (this._oCreateVisitFragment) {
                this._oCreateVisitFragment.close(); 
            }
        },
        
    });
});