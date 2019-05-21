const faker = require('faker')
const db = require('../models')
const Recipe = db.recipe
const Ingredient = db.ingredient
const Instruction = db.instruction

const recipes = []

console.log('Seeding recipes...')

for (let i = 0; i < 30; i++) {
  const newRecipe = {
    name: faker.random.words(3),
    description: faker.lorem.paragraph(),
    prep_time: `${faker.random.number({ min: 1, max: 120 })} minutes`,
    cook_time: `${faker.random.number({ min: 1, max: 120 })} minutes`,
    img_url: faker.image.image(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ingredients: [
      { name: faker.random.word(), img_url: faker.image.imageUrl() },
      { name: faker.random.word(), img_url: faker.image.imageUrl() },
      { name: faker.random.word(), img_url: faker.image.imageUrl() },
      { name: faker.random.word(), img_url: faker.image.imageUrl() },
    ],
    instructions: [
      { description: faker.lorem.paragraph(), order: faker.random.number({ min: 1, max: 4 }) },
      { description: faker.lorem.paragraph(), order: faker.random.number({ min: 1, max: 4 }) },
      { description: faker.lorem.paragraph(), order: faker.random.number({ min: 1, max: 4 }) },
      { description: faker.lorem.paragraph(), order: faker.random.number({ min: 1, max: 4 }) },
    ]
  }
  recipes.push(Recipe.create(newRecipe, {
    include: [
      { model: Ingredient },
      { model: Instruction }
    ]
  })
    .then(newRecipe => {
      newRecipe.addUser(faker.random.number({ min: 1, max: 2 }), { through: { createdBy: true } })
    })
  )
}

// console.log(recipes)
Promise.all(recipes)
  .then(records => {
    console.log('Seeding complete!')
  })
  .catch(console.log)
