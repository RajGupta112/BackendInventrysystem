import prisma from "../PrismaClient.js";

export const createProduct = async (req, res) => {
  
  const { name, casNumber, unit } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        casNumber,
        unit,
        userId: req.userId,
        inventory: {
          create: { quantity: 0 }
        }
      },
      include: { inventory: true }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Error creating product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { userId: req.userId },
      include: { inventory: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, casNumber, unit } = req.body;

  try {
    const product = await prisma.product.updateMany({
      where: { id: parseInt(id), userId: req.userId },
      data: { name, casNumber, unit }
    });

    if (product.count === 0) return res.status(404).json({ error: 'Product not found' });

    const updated = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { inventory: true }
    });

    res.status(200).json(updated); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id);

  try {
  
    await prisma.inventory.deleteMany({
      where: { productId: productId }
    });

    const product = await prisma.product.deleteMany({
      where: { 
        id: productId, 
        userId: req.userId 
      }
    });

    if (product.count === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product and inventory deleted successfully' });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ error: "Could not delete product. It may have related transactions." });
  }
};