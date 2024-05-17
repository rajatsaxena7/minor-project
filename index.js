const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable if available

const consumerKey =
  process.env.CONSUMER_KEY || "ck_086b844aceb48a953bd8b8c9ab602bae23223127";
const consumerSecret =
  process.env.CONSUMER_SECRET || "cs_a975ef002226e7b23b85adeeb18cabf1c7d9df9a";
const apiUrl = `https://srtgroceries.com/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

let products = [];

const fetchProducts = async () => {
  let allProducts = [];
  let page = 1;
  let fetchedProducts;

  do {
    try {
      const response = await axios.get(`${apiUrl}&per_page=100&page=${page}`);
      fetchedProducts = response.data;
      allProducts = allProducts.concat(fetchedProducts);
      console.log(
        `Fetched ${fetchedProducts.length} products from page ${page}`
      );
      page++;
    } catch (error) {
      console.error("Error fetching products:", error.message);
      fetchedProducts = [];
    }
  } while (fetchedProducts.length > 0 && page <= 6); // Limit to 6 pages

  products = allProducts;
  console.log("Total fetched products:", products.length); // Log the number of fetched products
};

// Fetch products initially and then every hour
fetchProducts();
setInterval(fetchProducts, 3600000); // 3600 seconds = 1 hour

// Endpoint for autocomplete
app.get("/autocomplete", (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Query parameter q is required" });
  }

  const lowerCaseQuery = query.toLowerCase();
  const results = products.filter((product) =>
    product.name.toLowerCase().includes(lowerCaseQuery)
  );

  res.json(results);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
