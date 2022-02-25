export const isEmpty = (object: Object): boolean => {
  if (typeof object === 'number') return false
  else if (typeof object === 'string') return object.length === 0
  else if (Array.isArray(object)) return object.length === 0
  else if (typeof object === 'object') return object == null || Object.keys(object).length === 0
  else if (typeof object === 'boolean') return false
  else return !object
}
