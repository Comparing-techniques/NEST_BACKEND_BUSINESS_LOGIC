/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { extname } from 'path';

const allowedExtensions = {
  excel: ['.xls', '.xlsx', '.xlsm'],
  video: ['.mp4', '.avi', '.mov'],
};

export const noFilesProvided = (): string => {
  return 'No se han proporcionado archivos';
};

export const noTwoFilesProvided = (): string => {
  return 'No se han proporcionado dos archivos (Video y Excel)';
};

export const fileAlreadyExists = (
  fileName: string,
  fileType: string,
): string => {
  return `Ya existe un archivo de tipo ${fileType} con el nombre ${fileName}`;
};

export const invalidFileType = (fileType: string): string => {
  return `El tipo de archivo ${fileType} no es válido`;
};

export const isAllowedExtension = (
  file: Express.Multer.File,
  typeFile: string,
): boolean => {
  const fileExt = extname(file.originalname).toLowerCase();
  // Normalizamos both sides a minúsculas para evitar mismatches
  return allowedExtensions[typeFile]
    .map((ext) => ext.toLowerCase())
    .includes(fileExt);
};
