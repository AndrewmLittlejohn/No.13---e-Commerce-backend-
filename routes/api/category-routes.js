const router = require('express').Router();
const { Category, Product, Tag, ProductTag } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products 
  try {
    const category = await Category.findAll({
      include: [{ model: Product}],
    });
      return res.json(category);
  } catch (err) {
    res.status(500).json(err);
  }   
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product}]
    });
      if (!category){
        res.status(404).json({message: 'No Category found by that id.' });
        return;
      }
      return res.json(category);
  }catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try{
    const newCategory = await Category.create({
    category_name: req.body.category_name,
    });
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }    
});

router.put('/:id', async (req,res) => {
  try{     const category = await Category.findByPk(req.params.id) 
    if (!category){
      res.status(404).json({message: 'No Category found by that id.' });
      return;
    } else {
    await Category.update(
      {category_name: req.body.category_name},
      {where: {id: req.params.id}}
    );  
    const updatedCategory = await Category.findByPk(req.params.id);
      res.send(updatedCategory);
    res.send(category);
 } } catch (err) {
    res.status(500).json('Error, update did not execute')
  } 
  });
  
  // router.put('/:id', (req, res) => {
  //   // update product data
  //   Product.update(req.body, {
  //     where: {
  //       id: req.params.id,
  //     },
  //   })
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

  
router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    const category = await Category.destroy({
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }    
});

module.exports = router;
