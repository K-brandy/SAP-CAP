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

   
        this .on('createAgendaEntry', async req => {
          const { visitId, visitorID } = req.data; // Corrected to visitId
          console.log("Creating Agenda Entry for Visit ID: ", visitId, " with Visitor ID: ", visitorID);
      
          // Check if visit and visitor exist
          const visit =  await db.read(SELECT.one.from('CatalogService.Visits').where({ ID: visitId })); // Corrected to visitId
          const visitor =  await db.read(SELECT.one.from('CatalogService.Visitors').where({ ID: visitorID }));
      
          if (!visit || !visitor) {
            req.error(400, 'Invalid visitId or visitorID'); // Corrected to visitId
            return;
          }
      
          // Create the Agenda entry
          const agenda =  await db.read(INSERT.into('CatalogService.Agenda').entries({
            visitID: visitId, // Corrected to visitId
            visitorID: visitorID,
            // Add other required fields here (topic, description, outcome, etc.)
          }));
      
          return agenda;
        });
   
    
});
