const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { Visits, Visitors } = this.entities; // Import entities

    // Save Business Partner action
    this.on('SaveBusinessPartner', async (req) => {
        const { ID } = req.data;

        try {
            // Perform the save operation on the Business_Partners entity
            const result = await UPDATE(Visitors).set({ status: 'Saved' }).where({ ID: ID });

            return result ? true : false;
        } catch (err) {
            console.error("Error saving Business Partner:", err);
            return false;
        }
    });

    // Assign Business Partner to Book action
    this.on('assignVisitorToVisit', async (req) => {
        const { visitId, bpID } = req.data;  // Extract the parameters
    
        console.log("Assigning Visit ID: ", visitId, " with Business Partner ID: ", bpID);
    
        if (!visitId || !bpID) {
            req.error(400, 'Visit ID and Business Partner ID are required');
            return;
        }
    
        const db = cds.transaction(req);
    

        const existingAssignment = await db.read('my.bookshop.Business_Partners')
            .where({ ID: bpID, 'books.ID': visitId });  // Adjust this part if needed based on your relationship
    
        if (existingAssignment.length > 0) {
            req.error(400, 'This Business Partner is already assigned to this Book');
            return;
        }
    
        await db.update('my.bookshop.Business_Partners')
            .set({ 'books.ID': visitId })  // Assign the Book to the Business Partner
            .where({ ID: bpID });
    
        // Optionally, you can return the updated Business Partner or Book
        return db.read('my.bookshop.Business_Partners').where({ ID: bpID });
    });
    
    
    
    
});
