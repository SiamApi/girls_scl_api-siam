const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { group } = require('console');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  // Get the query parameters
  const classId = 9;
  const group = req.query.group;
  const sessionId = '2';
  const shift = req.query.shift;

  // Define the mapping for shift values
  const shiftMappings = {
    morning: 1,
    day: 2, // You can use any value for mixed case
  };
  const groupMAPING = {
    scince: 1,
    arts: 2,
    commerce:3
  }

  // Determine the shift ID based on the shift query parameter
  const shiftId = shiftMappings[shift.toLowerCase()] || '';
  const grpid = groupMAPING[group.toLowerCase()] || '';

  // If shiftId is not found, it defaults to an empty string

  // Define the URL for the POST request
  const url = 'https://cgghs.edu.bd/welcome/get_student_list';

  // Define the payload (data) for the POST request
  const payload = new URLSearchParams({
    class_id: classId,
    department_id: grpid,
    session_id: sessionId,
    shift: shiftId,
  });

  // Define the headers for the POST request
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    // Add any other headers here if needed
  };

  // Send the POST request with Axios
  axios
    .post(url, payload, { headers })
    .then((response) => {
      // Check if the request was successful (status code 200)
      if (response.status === 200) {
        const data_list = [];

        // Load the HTML content with Cheerio
        const $ = cheerio.load(response.data);

        // Find all the table rows (tr) in the HTML content
        $('tr').each((index, row) => {
          // Extract the text from the first 3 table data (td) elements
          const tds = $(row).find('td').slice(0, 3);

          // Extract the data from the <td> elements
          if (tds.length === 3) {
            const data = {
              roll: tds.eq(0).text().trim(),
              id_no: tds.eq(1).text().trim(),
              name: tds.eq(2).text().trim(),
              developer:"SIAM RAHMAN"
            };
            data_list.push(data);
          }
        });

        // Return the data as JSON response
        res.json(data_list);
      } else {
        res.status(response.status).send('Failed to fetch data.');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal server error.');
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
