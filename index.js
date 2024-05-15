const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

const consumerKey = "ck_086b844aceb48a953bd8b8c9ab602bae23223127";
const consumerSecret = "cs_a975ef002226e7b23b85adeeb18cabf1c7d9df9a";
const apiUrl = `https://srtgroceries.com/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=100`;

let products = [];

const fetchProducts = async () => {
  try {
    const response = await axios.get(apiUrl);
    products = response.data;
    console.log("Fetched products:", products); // Log fetched products
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Fetch products initially and then every hour
fetchProducts();
setInterval(fetchProducts, 3600000);

// Endpoint for autocomplete
app.get("/autocomplete", (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Query parameter q is required" });
  }

  console.log("Received query:", query);

  const lowerCaseQuery = query.toLowerCase();
  const results = products.filter((product) =>
    product.name.toLowerCase().includes(lowerCaseQuery)
  );

  console.log("Filtered results:", results);

  res.json(results);
});
