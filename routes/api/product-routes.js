const router = require('express').Router();
const { Product, Category, Tag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try{
    const product = await Product.findAll({
      include: [{ model: Tag }, { model: Category }],
    });
    if (!product) {
      res.status(404).json({ message: 'No product found by that id' });
      return;
    }
      return res.json(product);
  } catch (err) {
    res.status(500).json(err)
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try{
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Tag }, { model: Category }],
    });
    if (!product){
      res.status(404).json({message: 'No Product found by that id.' });
      return;
    }
    return res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  console.log('Request body:', req.body);
  try{
    const product = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id
      });
      
      console.log('Request 1 body:', product);

      if (Array.isArray(req.body.tagIds) && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        await ProductTag.bulkCreate(productTagIdArr);
      } res.status(200).json(product);
    } catch(err) {
      console.log(err);
      res.status(400).json(err);
    };
});

// update product
// router.put('/:id', (req, res) => {
//   // update product data
//   Product.update(
//     { 
//       product_name: req.body.product_name,
//       price: req.body.price,
//       stock: req.body.stock,
//       category_id: req.body.category_id
//     },  
//     {
//       where: {
//         id: req.params.id,
//       },
//     }
//   )
//     .then((product) => {
//       // find all associated tags from ProductTag
//       return ProductTag.findAll({ where: { product_id: req.params.id } });
//     })
//     .then((productTags) => {
//       // get list of current tag_ids
//       const productTagIds = productTags.map(({ tag_id }) => tag_id);
//       // create filtered list of new tag_ids
//       const newProductTags = req.body.tagIds
//         .filter((tag_id) => !productTagIds.includes(tag_id))
//         .map((tag_id) => {
//           return {
//             product_id: req.params.id,
//             tag_id,
//           };
//         });
//       // figure out which ones to remove
//       const productTagsToRemove = productTags
//         .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
//         .map(({ id }) => id);

//       // run both actions
//       return Promise.all([
//         ProductTag.destroy({ where: { id: productTagsToRemove } }),
//         ProductTag.bulkCreate(newProductTags),
//       ]);
//     })
//     .then((updatedProductTags) => res.json(updatedProductTags))
//     .catch((err) => {
//       // console.log(err);
//       res.status(400).json(err);
//     });
// });

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, price, stock, category_id, tagIds } = req.body;

    // Update product
    await Product.update(
      { product_name, price, stock, category_id },
      { where: { id } }
    );

    // Find all associated tags
    const productTags = await ProductTag.findAll({ where: { product_id: id } });

    // Get current tag IDs
    const currentTagIds = productTags.map(({ tag_id }) => tag_id);

    // Create filtered list of new tag IDs
    const newTagIds = tagIds.filter(tagId => !currentTagIds.includes(tagId));

    // Create array of new ProductTag objects to bulk create
    const newProductTags = newTagIds.map(tagId => {
      return { product_id: id, tag_id: tagId };
    });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try{
    const product = await Product.destroy({
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }    
});

module.exports = router;

// the async route wasn't working so I tried the .then variety and it worked, then I tried async again and it too worked, odd. 
// router.delete('/:id', (req, res) => {
//   // Looks for the books based on isbn given in the request parameters and deletes the instance from the database
//   Product.destroy({
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((deletedProduct) => {
//       res.json(deletedProduct);
//     })
//     .catch((err) => res.json(err));
// });
