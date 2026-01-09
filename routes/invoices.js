import express from "express";
import Invoice from "../models/Invoice.js";

const router = express.Router();

// Create
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const invoice = new Invoice(payload);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create invoice" });
  }
});

// Read (list) with search & sort
router.get("/", async (req, res) => {
  try {
    const {
      q,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 50,
    } = req.query;
    const query = {};

    if (q) {
      const qLower = q.toLowerCase();
      query.$or = [
        { "client.name": { $regex: qLower, $options: "i" } },
        { "client.mobile": { $regex: qLower, $options: "i" } },
        { _id: { $regex: qLower, $options: "i" } },
      ];
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const invoices = await Invoice.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Invoice.countDocuments(query);
    res.json({ data: invoices, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

// Read single
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Not found" });
    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // ensures required fields are validated
    });

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(updatedInvoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update invoice", error: err });
  }
});

// Delete invoice
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({
      message: "Invoice deleted successfully",
      id: deletedInvoice._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete invoice", error: err });
  }
});

export default router;
