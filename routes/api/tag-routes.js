const router = require('express').Router();
const { Tag, Product, ProductTag, } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try{
    const tag = await Tag.findAll({
      include: [{model: Product}],
    });
    return res.json(tag);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product}],
    });
    if(!tag) {
      res.status(404).json({message: 'No Tag found by that id'});
      return;
    }
    return res.json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  console.log('Request body:', req.body);
  try{
    const tag = await Tag.create({
      tag_name: req.body.tag_name,
    });

    console.log('Response body:', tag);
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try{
    const tag = await Tag.findByPk(req.params.id)
    if(!tag){
      res.status(404).json({message: 'No Tag found by that id'});
      return;
    }
    Tag.tag_name = req.body.tag_name;
    await tag.update();
    res.send(tag);
  } catch (err) {
    req.status(500).json('Error, update did not execute')
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try{ 
  const tag = await Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
  res.status(200).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
