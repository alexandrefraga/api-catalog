export const mockStackError = (): Error => {
  const error = new Error()
  error.stack = 'any_stack'
  return error
}
