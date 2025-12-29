import prisma from "../PrismaClient.js";

export const getInventory = async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      where: {
        product: {
          userId: req.userId 
        }
      },
      include: {
        product: true 
      }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

export const updateStock = async (req, res) => {
  const { productId, quantity, type } = req.body;

  try {
    // 1. Find the product and verify ownership
    const product = await prisma.product.findFirst({
      where: { 
        id: parseInt(productId), 
        userId: req.userId 
      },
      include: { inventory: true }
    });

    if (!product || !product.inventory) {
      return res.status(404).json({ error: 'Product or Inventory record not found' });
    }

    let newQty = product.inventory.quantity;
    const amount = parseFloat(quantity);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    if (type === 'IN') {
      newQty += amount;
    } else if (type === 'OUT') {
      if (newQty < amount) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      newQty -= amount;
    } else {
      return res.status(400).json({ error: 'Invalid operation type' });
    }

    
    const updatedInventory = await prisma.inventory.update({
      where: { id: product.inventory.id },
      data: { quantity: newQty },
      include: { product: true }
    });

    res.json(updatedInventory);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};