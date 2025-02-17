sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'ns/businesspartners/test/integration/FirstJourney',
		'ns/businesspartners/test/integration/pages/Business_PartnersList',
		'ns/businesspartners/test/integration/pages/Business_PartnersObjectPage'
    ],
    function(JourneyRunner, opaJourney, Business_PartnersList, Business_PartnersObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('ns/businesspartners') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBusiness_PartnersList: Business_PartnersList,
					onTheBusiness_PartnersObjectPage: Business_PartnersObjectPage
                }
            },
            opaJourney.run
        );
    }
);