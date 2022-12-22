const express = require('express');
const router = express.Router();
const {
  createPet,
  getPets,
  getPetById,
  getPetsByCompanionId,
  updatePet,
} = require('../db');
const { requireUser } = require('./utils');

// GET: /api/pets
router.get('/', async (req, res, next) => {
  try {
    const pets = await getPets();

    res.send(pets);
  } catch (error) {
    next(error);
  }
});

// POST: /api/pets
router.post('/', requireUser, async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, breed, companionId } = req.body;

    const newPet = await createPet({ name, breed, companionId });

    res.send(newPet);
  } catch (error) {
    next(error);
  }
});

// GET: /api/pets/:id
router.get('/:id', async (req, res, next) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const pets = await getPetById(id);
    res.send(pets);
  } catch (error) {
    next(error);
  }
});

// GET: /api/pets/companion/:id
router.get('/companion/:id', async (req, res, next) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const pets = await getPetsByCompanionId(id);
    res.send(pets);
  } catch (error) {
    next(error);
  }
});

// PATCH: /api/pets/:id
router.patch('/:id', requireUser, async (req, res, next) => {
  try {
    console.log('companion in patch: ', req.companion);
    const { companion } = req;
    const { id } = req.params;
    // console.log(req.body);
    const pet = await getPetById(id);
    if (pet.companionId !== companion.id) {
      next({
        name: 'Credential Mismatch',
        message: 'You must be the companion of this pet to update.',
      });
    } else {
      const updatedPet = await updatePet(id, req.body);
      res.send(updatedPet);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
