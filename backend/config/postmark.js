const postmark = require('postmark');

// Créer une instance du client Postmark
const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

module.exports = client;
