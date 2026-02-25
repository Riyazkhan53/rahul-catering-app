import OrderRequest from "../models/OrderRequest.js";

// PUBLIC — called from the website (no auth required)
export async function createOrderRequest(req, res) {
  try {
    const { name, contact, functionType, paxCount, dishes, services } = req.body;

    if (!name || !contact || !functionType || !paxCount) {
      return res.status(400).json({ message: "name, contact, functionType, and paxCount are required" });
    }

    const orderRequest = await OrderRequest.create({
      name,
      contact,
      functionType,
      paxCount: Number(paxCount),
      dishes: dishes || [],
      services: services || [],
    });

    res.status(201).json(orderRequest);
  } catch (err) {
    console.error("Error creating order request:", err);
    res.status(500).json({ message: err.message });
  }
}

// AUTHENTICATED — called from the catering app dashboard
export async function getOrderRequests(req, res) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await OrderRequest.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("Error fetching order requests:", err);
    res.status(500).json({ message: err.message });
  }
}

// AUTHENTICATED — update status (viewed, accepted, rejected)
export async function updateOrderRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updated = await OrderRequest.findByIdAndUpdate(
      id,
      { status, ...(notes !== undefined && { notes }) },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Order request not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating order request:", err);
    res.status(500).json({ message: err.message });
  }
}
