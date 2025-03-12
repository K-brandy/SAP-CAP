sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'visitors/visitors/test/integration/FirstJourney',
		'visitors/visitors/test/integration/pages/VisitorsList',
		'visitors/visitors/test/integration/pages/VisitorsObjectPage'
    ],
    function(JourneyRunner, opaJourney, VisitorsList, VisitorsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('visitors/visitors') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheVisitorsList: VisitorsList,
					onTheVisitorsObjectPage: VisitorsObjectPage
                }
            },
            opaJourney.run
        );
    }
);