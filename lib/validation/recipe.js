// ------------------------------ RECIPE VALIDATION HELPERS ------------------------------

const validRecipe = ({ name, description, prep_time, cook_time, userId }) => {
  // Required fields
  const fieldsPresent = name && description && prep_time && cook_time && userId
  // Data types
  const validName = typeof name === 'string'
  const validDescription = typeof description === 'string'
  const validPrep = typeof prep_time === 'string'
  const validCook = typeof cook_time === 'string'
  const validUserId = typeof userId === 'number'

  return fieldsPresent && validName && validDescription && validPrep && validCook && validPrep && validCook && validUserId
}

const validInstructions = (instructions) => {
  // Check if there are no instructions
  if (instructions.length < 1) return false

  // Validate presence & type
  for (let instruction of instructions) {
    const { description, order } = instruction
    if (!description || !order) return false
    if (typeof description !== 'string' || typeof order !== 'number') return false
  }
  return true
}

const validIngredients = (ingredients) => {
  // Check if there are no ingredients
  if (ingredients.length < 1) return false

  // Validate presence & type
  for (let ingredient of ingredients) {
    const { name } = ingredient
    if (!name || typeof name !== 'string') return false
  }
  return true
}

module.exports = {
  validRecipe,
  validIngredients,
  validInstructions
}