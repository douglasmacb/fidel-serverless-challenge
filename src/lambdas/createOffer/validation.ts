import { Validation } from '../../common/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '../../common/helpers/validators'

export const makeValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['brandId', 'name']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
