

export default function searchNestedObj(obj, keysToFind, path = []) {
  if (!obj || typeof obj !== 'object') {
    return null;
  }

  for (const keyToFind of keysToFind) {
    if (keyToFind in obj) {
      return { object: obj, path: [...path] };
    }
  }

  for (const key in obj) {
    const result = searchNestedObj(obj[key], keysToFind, [...path, key]);
    if (result !== null) {
      console.log(result);
      return result;
    }
  }

  return null;
}





