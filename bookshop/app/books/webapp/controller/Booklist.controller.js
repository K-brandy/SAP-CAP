sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("ns.books.controller.Booklist", {
        onInit() {
            var oViewModel = new JSONModel({
                rowCount: 0

            });
            this.getView().setModel(oViewModel, "view");
        },


        onSearchFieldSearch: function (oEvent) {
            const sQuery = oEvent.getParameter("query");
            const aFilters = [];

            if (sQuery) {
                const inputPrice = parseFloat(sQuery);
                const isNumber = !isNaN(inputPrice);
                const filters = [];

                // Apply ID filter only if sQuery is a number
                if (!isNaN(parseInt(sQuery))) {
                    filters.push(new Filter("ID", FilterOperator.EQ, sQuery));
                    filters.push(new Filter("stock", FilterOperator.EQ, sQuery));
                }

                // String filters
                filters.push(
                    new Filter("title", FilterOperator.Contains, sQuery),
                    new Filter("descr", FilterOperator.Contains, sQuery),
                    new Filter("currency_code", FilterOperator.Contains, sQuery),
                    new Filter("author", FilterOperator.Contains, sQuery),
                    new Filter("genre", FilterOperator.Contains, sQuery),
                );

                // Numeric filter
                if (isNumber) {
                    filters.push(
                        new Filter({
                            filters: [
                                new Filter("price", FilterOperator.GE, inputPrice),
                                new Filter("price", FilterOperator.LT, inputPrice + 1)
                            ],
                            and: true
                        })
                    );
                }

                // Combine filters using OR condition
                aFilters.push(new Filter({
                    filters: filters,
                    and: false
                }));
            }
            const oTable = this.byId("idBooksTable");
            const oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.filter(aFilters);  // Apply the filters to the table
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
            var oTable = this.byId("idBooksTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                var iCount = oBinding ? oBinding.getLength() : 0;
                oTable.setHeaderText("Total Books: " + iCount);
                this.getView().getModel("view").setProperty("/rowCount", iCount);

            }
        },

        onBeforeRendering: function () {
            var oTable = this.byId("idBooksTable");

            // Ensure row count is updated before rendering
            this.updateRowCount(oTable);

            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.attachChange(function () {
                    this.updateRowCount(oTable);
                }.bind(this));
            }
        },



    });
});