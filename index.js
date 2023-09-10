const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    // Get the query parameters
    const classId = 9;
    const group = req.query.group;
    const sessionId = '2';
    const shift = req.query.shift;

    // Check if group and shift parameters are missing
    if (!group || !shift) {
      return res.status(400).json({ error: 'Please enter both group and shift parameters.' });
    }

    // Define the mapping for shift values
    const shiftMappings = {
      morning: 1,
      day: 2,
    };

    const groupMappings = {
      scince: 1,
      arts: 2,
      commerce: 3,
    };

    // Determine the shift ID based on the shift query parameter
    const shiftId = shiftMappings[shift.toLowerCase()] || '';
    const groupId = groupMappings[group.toLowerCase()] || '';

    // If shiftId is not found, it defaults to an empty string

    // Define the URL for the POST request
    const url = 'https://cgghs.edu.bd/welcome/get_student_list';

    // Define the payload (data) for the POST request
    const payload = new URLSearchParams({
      class_id: classId,
      department_id: groupId,
      session_id: sessionId,
      shift: shiftId,
    });

    // Define the headers for the POST request
    const headers = {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9,bn;q=0.8",
      "Cache-Control": "max-age=0",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=e13331cad2edee03ab835583585385dc; ci_session=a%3A5%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%22c84d53f088033624ca249c79c2897656%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A13%3A%22103.139.9.177%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A111%3A%22Mozilla%2F5.0+%28Windows+NT+10.0%3B+Win64%3B+x64%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F116.0.0.0+Safari%2F537.36%22%3Bs%3A13%3A%22last_activity%22%3Bi%3A1694335676%3Bs%3A9%3A%22user_data%22%3Bs%3A0%3A%22%22%3B%7D7b1cdb0cfd28398df8b40da936ca5bd0",
      "Host": "cgghs.edu.bd",
      "Origin": "https://cgghs.edu.bd",
      "Referer": "https://cgghs.edu.bd/student_list",
      "Sec-Ch-Ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
      "Sec-Ch-Ua-Mobile": "?1",
      "Sec-Ch-Ua-Platform": "\"Android\"",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
    };

    // Send the POST request with Axios
    const response = await axios.post(url, payload, { headers });

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
            developer: "SIAM RAHMAN",
          };
          data_list.push(data);
        }
      });

      // Return the data as JSON response
      res.json(data_list);
    } else {
      res.status(response.status).send('Failed to fetch data.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
