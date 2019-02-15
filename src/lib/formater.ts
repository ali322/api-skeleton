import { ValidationError } from "class-validator";

export function formatedValidationError(errs: ValidationError[]): string[] {
  return errs.reduce((prev, cur) => {
    return prev.concat(cur)
  }, [])
}