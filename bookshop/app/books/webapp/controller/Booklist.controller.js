sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
       "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel,Filter,FilterOperator ) => {
    "use strict";

    return Controller.extend("ns.books.controller.Booklist", {
        onInit() {
            var oViewModel = new JSONModel({
                rowCount: 0
               
            });
            this.getView().setModel(oViewModel, "view");
        },


        onSearchFieldSearch: function (oEvent) {
    var aFilter = [];
    var sQuery = oEvent.getParameter("query");

    if (sQuery) {
        aFilter.push(new Filter("title", FilterOperator.Contains, sQuery));
    }

    // Get the table and its binding
    var oTable = this.byId("idBooksTable");
    var oBinding = oTable.getBinding("items");

    if (oBinding) {
        oBinding.filter(aFilter); 
        this.updateRowCount();
      
    }

   
},

		onColumnListItemPress: function(oEvent) {
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