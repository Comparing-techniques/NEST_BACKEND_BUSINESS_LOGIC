export const invalidBoolean = (field: string) =>
  `El campo ${field} no es un booleano válido.`;

export const invalidLength = (field: string, min: number, max: number) =>
  `El campo ${field} debe tener entre ${min} y ${max} caracteres.`;

export const noEmptyField = (field: string) =>
  `El campo ${field} no puede estar vacío.`;

export const invalidString = (field: string) =>
  `El campo ${field} no es una cadena válida.`;

export const invalidEmail = (field: string) =>
  `El campo ${field} no es un correo electrónico válido.`;

export const invalidNumber = (field: string) =>
  `El campo ${field} no es un número válido.`;

export const invalidInt = (field: string) =>
  `El campo ${field} no es un número entero válido.`;

export const PASSWORD_INVALID_REGEX =
  'Las contraseñas contendrán al menos una letra mayúscula una letra minúscula y al menos un número o carácter especial';

export const alreadyExists = (value: string, field: string, entity: string) =>
  `El valor ${value} en ${field} ya existe en ${entity}.`;

export const notFoundById = (id: number, entity: string) =>
  `No se encontró entidad en ${entity} con el id ${id}.`;
