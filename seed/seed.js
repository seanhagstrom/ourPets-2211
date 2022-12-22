const { client } = require('../db/client.js');
const {
  createCompanion,
  getCompanions,
  getCompanionById,
  createPet,
  getPets,
  getPetById,
  getPetsByCompanionId,
  updatePet,
  updatePetAge,
  createTrick,
  getAllTricks,
  addTrickToPet,
  getTricksByPetId,
} = require('../db');
const { pets, companionsWithPasswords, tricks, petTricks } = require('./data');
const { buildSetString } = require('../utils');

//Drop tables to start fresh
const dropTables = async () => {
  try {
    console.log('Begin dropping tables');
    await client.query(`
    DROP TABLE IF EXISTS pet_tricks;
    DROP TABLE IF EXISTS tricks;
    DROP TABLE IF EXISTS pets;
    DROP TABLE IF EXISTS companions;
    `);

    console.log('All tables dropped');
  } catch (error) {
    console.error('Error dropping tables: ', error);
  }
};

// Creates tables
const createTables = async () => {
  try {
    console.log('Begin creating tables');
    await client.query(`
    CREATE TABLE companions(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );

    CREATE TABLE pets(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      breed VARCHAR(255) DEFAULT 'unknown',
      age INTEGER DEFAULT 5,
      "companionId" INTEGER REFERENCES companions(id)
    );

    CREATE TABLE tricks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE pet_tricks (
      "petId" INTEGER REFERENCES pets(id),
      "trickId" INTEGER REFERENCES tricks(id),
      UNIQUE("petId", "trickId")
    );

    `);

    console.log('All tables have been created');
  } catch (error) {
    console.error('Error creating tables: ', error);
  }
};

const createInitialUsers = async (listOfUsers) => {
  // const newList = [];

  // while (listOfUsers.length) {
  //   const user = listOfUsers.shift();
  //   newList.push(await createCompanion(user));
  // }
  // console.log(newList);
  // return newList;
  while (listOfUsers.length) {
    const user = listOfUsers.shift();
    await createCompanion(user);
  }
};

// Rebuilds our database with initial data.
const rebuildDB = async () => {
  try {
    await client.connect();
    await dropTables();
    await createTables();
    console.log('creating companionsWithPasswords');
    // await Promise.all(companionsWithPasswords.map(createCompanion));
    await createInitialUsers(companionsWithPasswords);

    console.log('getting all companions');
    const companionsCreated = await getCompanions();
    console.log('here they are', companionsCreated);
    console.log('creating pets');
    await Promise.all(pets.map(createPet));
    console.log('getting all pets');
    await getPets();
    console.log('get companion number 27');
    const number27 = await getCompanionById(27);
    console.log('number27 ', number27);
    console.log('getting pets by companion 27');
    const companion27Pets = await getPetsByCompanionId(27);
    console.log('companion 27 pets', companion27Pets);
    console.log('creating all tricks');
    await Promise.all(tricks.map(createTrick));
    await getAllTricks();
    console.log('adding tricks to pets');
    await Promise.all(petTricks.map((trick) => addTrickToPet(trick)));

    await getTricksByPetId(36);

    /************* Updating pet *************/
    // console.log('updating pet with id 8');
    // const oldPet = await getPetById(8);
    // console.log('our old pet: ', oldPet);

    // const newAge = await updatePetAge(8, 2);
    // console.log('our newAge pet: ', newAge);

    // const newPet = await updatePet(8, {
    //   name: 'Adonis',
    //   breed: 'Crazy Dogo',
    // });
    // console.log('our newPet: ', newPet);

    // console.log('our old pet: ', await getPetById(8));

    console.log('congratulations your database is set!');

    /************* End Updating pet *************/
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
  }
};

rebuildDB();
