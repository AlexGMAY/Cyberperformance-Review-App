const https = require('https');


// Function to shorten a URL using Da.gd
const shortenLink = (longUrl) => {
  return new Promise((resolve, reject) => {
    const url = `https://da.gd/shorten?url=${encodeURIComponent(longUrl)}`;

    https.get(url, (resp) => {
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      resp.on('end', () => {
        // Da.gd returns plain text, so we just return it directly
        const shortenedUrl = data.trim(); // Trim any whitespace or new lines
        resolve(shortenedUrl || longUrl); // Use the original link if shortening fails
      });

    }).on("error", (err) => {
      console.error("Error shortening link:", err.message);
      resolve(longUrl); // Return the original link in case of an error
    });
  });
};

module.exports = shortenLink;
