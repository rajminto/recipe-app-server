const faker = require('faker')
const db = require('../models')
const Recipe = db.recipe
// const User = db.user
const Ingredient = db.ingredient
const Instruction = db.instruction
const Tag = db.tag

const recipes = []

for (let i = 0; i < 1000; i++) {
  const newRecipe = {
    name: faker.random.words(3),
    description: faker.lorem.paragraph(),
    prep_time: `${faker.random.number()} seconds`,
    cook_time: `${faker.random.number()} minutes`,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: faker.random.number({ min: 1, max: 2 }),
    ingredients: [
      { name: faker.random.word(), quantity: faker.random.number({ min: 1, max: 10}) },
      { name: faker.random.word(), quantity: faker.random.number({ min: 1, max: 10 }) },
      { name: faker.random.word(), quantity: faker.random.number({ min: 1, max: 10 }) },
      { name: faker.random.word(), quantity: faker.random.number({ min: 1, max: 10 }) }
    ],
    instructions: [
      { description: faker.lorem.paragraph(), order: faker.random.number({ min: 1, max: 3 }) },
      { description: faker.lorem.paragraph(), order: faker.random.number({ min: 1, max: 3 }) },
      { description: faker.lorem.paragraph(), order: faker.random.number({ min: 1, max: 3 }) },
      { description: faker.lorem.paragraph(), order: faker.random.number({ min: 1, max: 3 }) },
    ],
    tags: [
      { name: faker.random.word() },
      { name: faker.random.word() }
    ]
  }
  recipes.push(Recipe.create(newRecipe, {
    include: [
      { model: Ingredient },
      { model: Instruction },
      { model: Tag }
    ]
  }))
}

// console.log(recipes)
Promise.all(recipes)
  .then(records => {
    console.log('Success!')
  })
  .catch(console.log)
