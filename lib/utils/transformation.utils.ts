export const bufferToData = <T>(buffer: Buffer): T => JSON.parse(buffer.toString());

export const dataToString = <T>(rawData: T): string => JSON.stringify(rawData);
