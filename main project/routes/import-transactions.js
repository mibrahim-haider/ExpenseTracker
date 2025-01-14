const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.post("/api/import-transactions", async (req, res) => {
    const newTransactions = req.body; // Array of transactions from the frontend

    try {
        for (const transaction of newTransactions) {
            const { date, type, amount, category, description } = transaction;

            // Format the date to 'YYYY-MM-DD'
            // const formattedDate = new Date(date).toISOString().slice(0, 10);

            try {
                // Insert the transaction directly, relying on the unique constraint
                const queryInsert = `
                   INSERT INTO Transactions (Date, Type, Amount, Category, Description, UserID)
                   VALUES (?, ?, ?, ?, ?, ?)
                   ON DUPLICATE KEY UPDATE
                   Type = VALUES(Type),
                   Amount = VALUES(Amount),
                   Category = VALUES(Category),
                   Description = VALUES(Description);
                `;
                await db.promise().query(queryInsert, [
                    date,
                    type,
                    amount,
                    category,
                    description,
                    req.session.user.id, // UserID from session
                ]);
            } catch (insertError) {
                // Handle duplicate entry error (MySQL error code: 1062)
                if (insertError.code === "ER_DUP_ENTRY") {
                    console.log(
                        `Duplicate transaction skipped: ${formattedDate}, ${type}, ${amount}, ${category}, ${description}`
                    );
                } else {
                    throw insertError; // Re-throw if it's a different error
                }
            }
        }

        res.status(200).json({ message: "Transactions imported successfully, duplicates skipped." });
    } catch (error) {
        console.error("Error importing transactions:", error);
        res.status(500).json({ message: "Error importing transactions." });
    }
});

module.exports = router;