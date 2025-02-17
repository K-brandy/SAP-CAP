sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'ns.businesspartners',
            componentId: 'Business_PartnersList',
            contextPath: '/Business_Partners'
        },
        CustomPageDefinitions
    );
});