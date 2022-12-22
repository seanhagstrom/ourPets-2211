const { client } = require('./client');
const { buildSetString } = require('../utils');
const bcrypt = require('bcrypt');
const saltRounds = 10;
/***************Companions start here***************/
//Inserts a companion
const createCompanion = async (companion) => {
  try {
    const { name, password } = companion;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // console.log('this is my hashed: ', hashedPassword);
    const {
      rows: [newCompanion],
    } = await client.query(
      `
    INSERT INTO companions(name, password)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *
    `,
      [name, hashedPassword]
    );
    // console.log(newCompanion);
    return newCompanion;
  } catch (error) {
    console.error(error);
  }
};

// Get all companions
const getCompanions = async () => {
  try {
    const { rows: companions } = await client.query(`
    SELECT id, name FROM companions;
    `);

    // console.log(companions);
    return companions;
  } catch (error) {
    console.error('Error getting companions: ', error);
  }
};

const getCompanionById = async (companionId) => {
  try {
    const {
      rows: [companion],
    } = await client.query(
      `
    SELECT * FROM companions
    WHERE id = $1;
    `,
      [companionId]
    );

    const { rows: pets } = await client.query(
      `
    SELECT * FROM pets
    WHERE "companionId" = $1;
    `,
      [companionId]
    );

    companion.pets = pets;
    delete companion.password;

    return companion;
  } catch (error) {
    console.error('Error in getCompanionById: ', error);
  }
};
const getCompanionByName = async (companionName) => {
  try {
    const {
      rows: [companion],
    } = await client.query(
      `
    SELECT * FROM companions
    WHERE name = $1;
    `,
      [companionName]
    );

    return companion;
  } catch (error) {
    console.error('Error in getCompanionById: ', error);
  }
};

const updateCompanion = async (id, fields = {}) => {
  const setString = await buildSetString(fields);

  try {
    const {
      rows: [companion],
    } = await client.query(
      `
    UPDATE companions
    SET ${setString}
    WHERE id = ${id}
    RETURNING id, name;
    `,
      Object.values(fields)
    );
    const { rows: pets } = await client.query(
      `
    SELECT * FROM pets
    WHERE "companionId" = $1;
    `,
      [id]
    );

    companion.pets = pets;

    return companion;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createCompanion,
  getCompanions,
  getCompanionById,
  getCompanionByName,
  updateCompanion,
};
