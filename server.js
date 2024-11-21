const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());



// POST Endpoint
app.post("/bfhl", (req, res) => {
    const { data, file_b64 } = req.body;

    try {
        const numbers = data.filter((item) => !isNaN(item));
        const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));
        const highestLowercase = alphabets.filter((item) => item === item.toLowerCase())
            .sort().pop() || null;
        const isPrimeFound = numbers.some((num) => isPrime(parseInt(num)));

        let fileResponse = {
            file_valid: false,
            file_mime_type: null,
            file_size_kb: null
        };

        if (file_b64) {
            try {
                const buffer = Buffer.from(file_b64, "base64");
                fileResponse = {
                    file_valid: true,
                    file_mime_type: "unknown/type", // MIME type detection can be added
                    file_size_kb: (buffer.length / 1024).toFixed(2)
                };
            } catch {
                fileResponse.file_valid = false;
            }
        }

        res.status(200).json({
            is_success: true,
            user_id: "john_doe_17091999",
            email: "john@xyz.com",
            roll_number: "ABCD123",
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
            is_prime_found: isPrimeFound,
            ...fileResponse
        });
    } catch (error) {
        res.status(400).json({ is_success: false, message: "Invalid data", error: error.message });
    }
});

// GET Endpoint
app.get("/bfhl", (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Prime Number Helper
const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
