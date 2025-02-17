const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    this.on('SaveBusinessPartner', async (req) => {
        const { ID } = req.data;  // Get the ID from the request

        try {
            // Perform the save operation on the Business_Partners entity
            const result = await UPDATE('Business_Partners').set({ status: 'Saved' }).where({ ID: ID });

            // If the update is successful, return true
            return result ? true : false;
        } catch (err) {
            // Handle errors (log, throw, etc.)
            console.error("Error saving Business Partner:", err);
            return false;
        }
    });
});
