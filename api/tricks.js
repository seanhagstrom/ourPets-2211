const express = require('express');
const router = express.Router();
const {
  createTrick,
  getAllTricks,
  addTrickToPet,
  getTricksByPetId,
  destroyTrick,
  getTrickById,
  getPetById,
} = require('../db');
const { requireUser } = require('./utils');

// GET: api/tricks
router.get('/', async (req, res, next) => {
  try {
    const tricks = await getAllTricks();
    res.send(tricks);
  } catch (error) {
    next(error);
  }
});

// POST: /api/tricks
router.post('/', requireUser, async (req, res, next) => {
  try {
    console.log(req.body);
    const { title } = req.body;

    const newTrick = await createTrick({ title });

    res.send(newTrick);
  } catch (error) {
    next(error);
  }
});

// POST: /api/tricks/:trickId/pet/:petId
router.post('/:trickId/pet/:petId', requireUser, async (req, res, next) => {
  try {
    const { trickId, petId } = req.params;
    const trickToAdd = await getTrickById(trickId);
    const petToAddTrick = await getPetById(petId);

    if (!trickToAdd || !petToAddTrick) {
      next({
        name: 'MissingTrickOrPet',
        message: 'Please select a valid trick or pet',
      });
    } else {
      await addTrickToPet({ petId, trickId });

      res.send(
        `Your pet: ${petToAddTrick.name} can now perform ${trickToAdd.title} as a trick! Woooohooooo!`
      );
    }
  } catch (error) {
    next(error);
  }
});

// DELETE: /api/tricks/:id
router.delete('/:id', requireUser, async (req, res, next) => {
  try {
    const { id } = req.params;

    const findTrick = await getTrickById(id);

    if (findTrick) {
      const deletedTrick = await destroyTrick(id);
      res.send(
        `you've successfully deleted the trick with title: ${deletedTrick.title}. Sad day :/`
      );
    } else {
      res.send(`No trick with id: ${id}`);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
