sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, Filter, FilterOperator) => {
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
         }
        
        


    });
});