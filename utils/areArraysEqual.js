const areArraysEqual = (array1, array2) => {
  const sortedArray1 = array1.sort()
  const sortedArray2 = array2.sort()

  if (array1.length !== array2.length) {
    return false
  }

  for (let i = 0; i < sortedArray1.length; i++) {
    if (sortedArray1[i] !== sortedArray2[i]) {
      return false
    }
  }

  return true
}

export { areArraysEqual }
