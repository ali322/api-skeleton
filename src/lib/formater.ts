import { ValidationError } from 'class-validator'

export function formatedValidationError(errs: ValidationError[]): string[] {
  return errs.reduce((prev, cur): any => {
    return prev.concat(
      Object.keys(cur.constraints).map((k): string => cur.constraints[k])
    )
  }, [])
}
