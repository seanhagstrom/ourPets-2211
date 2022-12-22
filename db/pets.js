const { client } = require('./client');
const { buildSetString } = require('../utils');

// Inserts a pet
const createPet = async (pet) => {
  try {
    const { name, breed, companionId } = pet;

    const {
      rows: [newPet],
    } = await client.query(
      `
    INSERT INTO pets(name, breed, "companionId")
    VALUES ($1, $2, $3)
    RETURNING *
    `,
      [name, breed, companionId]
    );
    // console.log(newPet);
    return newPet;
  } catch (error) {
    console.error(error);
  }
};

// Get all pets
async function getPets() {
  try {
    const { rows: pets } = await client.query(`
    SELECT id, name, breed, age FROM pets;
    `);

    // console.log(pets);
    return pets;
  } catch (error) {
    console.error(error);
  }
}

const getPetById = async (petId) => {
  try {
    const {
      rows: [pet],
    } = await client.query(
      `
          SELECT * FROM pets
          WHERE id = $1;
          `,
      [petId]
    );

    const {
      rows: [companion],
    } = await client.query(
      `
    SELECT id, name FROM companions
    WHERE id = $1
    `,
      [pet.companionId]
    );
    console.log('is this the companion I think it is?', companion);
    pet.companion = companion;
    // console.log(pet);
    return pet;
  } catch (error) {
    console.error('Error in getPetById: ', error);
  }
};

// Gets a pet by companion id
const getPetsByCompanionId = async (companionId) => {
  try {
    const { rows: pets } = await client.query(
      `
    SELECT * FROM pets
    WHERE "companionId" = $1;
    `,
      [companionId]
    );

    // console.log(pets);
    return pets;
  } catch (error) {
    console.error(error);
  }
};

const updatePetAge = async (id, age) => {
  try {
    const {
      rows: [pet],
    } = await client.query(
      `
    UPDATE pets
    SET age = $1
    WHERE id = $2
    RETURNING *;
    `,
      [age, id]
    );

    // console.log(pet);
    return pet;
  } catch (error) {
    console.error(error);
  }
};

const updatePet = async (id, fields = {}) => {
  // console.log('these are our update fields: ', fields);
  // { name: 'Adonis', breed: 'Crazy Dogo' }
  // name = 'Adonis', breed = 'Crazy Dogo'
  // const keys = Object.keys(fields);
  // console.log('these are keys: ', keys);

  // for (let key of keys) {
  //   if (!['name', 'breed', 'age'].includes(key)) return;
  // }

  // const setString = keys
  //   .map((key, index) => `"${key}"=$${index + 1}`)
  //   .join(', ');
  // console.log('this is my setString: ', setString);

  // console.log('these are our values: ', Object.values(fields));
  // SET name = 'Adonis', breed = 'Crazy Dogo'
  // SET 'name = $1, breed = $2'
  //    0     1
  // [name, breed]
  const setString = await buildSetString(fields);

  try {
    const {
      rows: [pet],
    } = await client.query(
      `
    UPDATE pets
    SET ${setString}
    WHERE id = ${id}
    RETURNING *;
    `,
      Object.values(fields)
    );
    // console.log(pet);
    return pet;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createPet,
  getPets,
  getPetById,
  getPetsByCompanionId,
  updatePet,
  updatePetAge,
};
