const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { Visits, Visitors } = this.entities; // Import entities

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
    

        const existingAssignment = await db.read('my.bookshop.Visitors')
            .where({ ID: visitorID, 'visits.ID': visitId });  // Adjust this part if needed based on your relationship
    
        if (existingAssignment.length > 0) {
            req.error(400, 'This Visitor is already assigned to this Book');
            return;
        }
    
        await db.update('my.bookshop.Visitors')
            .set({ 'visits.ID': visitId })  // Assign the Book to the Visitors
            .where({ ID: visitorID });
    
        // Optionally, you can return the updated Visitors or Book
        return db.read('my.bookshop.Visitors').where({ ID: visitorID });
    });
    
    
    
    
});
