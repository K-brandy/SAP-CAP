const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { Visits, Visitors } = this.entities; // Import entities

    this.before('CREATE', Visits, async (req) => {
        const { ID: lastID } = await SELECT.one`max(ID) as ID`.from(Visits);
        req.data.ID = (lastID || 0) + 1;  // Increment ID
    });


    // Save Visitor action
    this.on('SaveVisitor', async (req) => {
        const { ID } = req.data;

        try {
            // Perform the save operation on the Visitorentity
            const result = await UPDATE(Visitors).set({ status: 'Saved' }).where({ ID: ID });

            return result ? true : false;
        } catch (err) {
            console.error("Error saving Visitor:", err);
            return false;
        }
    });

    // Assign Visitor to Visit action
    this.on('assignVisitorToVisit', async (req) => {
        const { visitId, visitorID } = req.data;  // Extract the parameters
        console.log("Assigning Visit ID: ", visitId, " with Visitor ID: ", visitorID);
        if (!visitId || !visitorID) {
            req.error(400, 'Visit ID and Visitor ID are required');
            return;
        }
    
        const db = cds.transaction(req);
    
        try {
            // Insert a new record into visitsToVisitors
            await db.run(
                INSERT.into('my.bookshop.visitsToVisitors').entries({ visitID: visitId, visitorID: visitorID })
            );
    
            // Optionally, return the newly inserted record
            const visitsToVisitors = await db.read('my.bookshop.visitsToVisitors').where({ visitID: visitId, visitorID: visitorID });
            console.log("visitsToVisitors ", visitsToVisitors)
    
        } catch (error) {
            console.error("Error assigning visitor to visit:", error);
            req.error(500, 'Internal Server Error');
        }
    });

   
    this.on('createAgendaEntry', async (req) => {
        const { visitId, visitorID, topic, description, outcome } = req.data;
    
        console.log("Creating Agenda Entry:", {
            visitId,
            visitorID,
            topic,
            description,
            outcome
        });
    
        if (!visitId || !visitorID || !topic || !description || !outcome) {
            req.error(400, 'All fields (visitId, visitorID, topic, description, outcome) are required');
            return;
        }
    
        const db = cds.transaction(req);
    
        try {
            // Ensure related Visit and Visitor exist
            const visit = await db.read('CatalogService.Visits').where({ ID: visitId });
            const visitor = await db.read('CatalogService.Visitors').where({ ID: visitorID });
    
            if (!visit.length || !visitor.length) {
                req.error(400, 'Invalid Visit ID or Visitor ID');
                return;
            }
    
            // Insert the agenda entry with user-provided values
            await db.run(
                INSERT.into('CatalogService.Agenda').entries({
                    visitID: visitId,
                    visitorID: visitorID,
                    topic,
                    description,
                    outcome
                })
            );
    
            const agendaEntry = await db.read('CatalogService.Agenda')
                .where({ visitID: visitId, visitorID: visitorID });
    
            console.log("Agenda entry successfully created:", agendaEntry);
            return agendaEntry;
    
        } catch (error) {
            console.error("Error during agenda entry creation:", error);
            req.error(500, 'Internal Server Error');
        }
    });
    
    
    
});
