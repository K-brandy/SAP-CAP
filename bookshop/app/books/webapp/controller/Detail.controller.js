sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    "sap/m/MessageToast"
], function(Controller, History, MessageToast, JSONModel,Filter,FilterOperator,MessageBox) {
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
            //view model

            const oViewModel = new JSONModel({
                isEditable:false,
                rowCount:0


            });
            this.getView().setModel(oViewModel,"view");

   
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
        //search field for business partners
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
            
        // convert the value to an integer using parseInt()
            var stockValue = oView.byId("idStockInput").getValue();
            stockValue = stockValue ? parseInt(stockValue, 10) : 0;

            // Update properties
            oContext.setProperty("title", oView.byId("idTitleInput").getValue());
            oContext.setProperty("descr", oView.byId("idDescrInput").getValue());
            oContext.setProperty("author", oView.byId("idAuthorInput").getValue());
            oContext.setProperty("genre", oView.byId("idGenreInput").getValue());
            oContext.setProperty("stock", stockValue); 
            oContext.setProperty("price", oView.byId("idPriceInput").getValue().replace(",", "."));
            oContext.setProperty("currency_code", oView.byId("idCurrencyCodeInput").getValue());
        
            oModel.submitBatch("BooksBatchGroup")
                .then(function () {
                    MessageToast.show("Book details saved successfully!");
                })
                .catch(function (oError) {
                    MessageToast.show("Error saving book details: " + oError.message);
                });
        },

        
        
    });
});
