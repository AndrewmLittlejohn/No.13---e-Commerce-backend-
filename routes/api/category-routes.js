const router = require('express').Router();
const { Category, Product } = require('../../models');

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
    const Category = await Category.create({
    category_name: req.body.category_name,
    });
    res.status(200).json(Category);
  } catch (err) {
    res.status(400).json(err);
  }    
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{  const Category = await Category.findByPk(req.params.id) 
    if (!category){
      res.status(404).json({message: 'No Category found by that id.' });
      return;
    }
    Category.category_name = req.body.category_name;
    await Category.update();
    res.send(Category);
  } catch (err) {
    res.status(500).json('Error, update did not execute')
  } 
  });
  
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
