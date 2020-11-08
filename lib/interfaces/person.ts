import { KeyValueFrequency } from './shared';

export enum Gender {
  Man = 0,
  Woman = 1
}

export enum HeadClassCode {
  Specific = 0,
  Generic = 1,
  Unused = 2
}

export enum BodyTypeCode {
  AverageHeightAndLean = 1,
  AverageHeight = 2,
  AverageHeightAndMuscular = 3,
  TallAndLean = 4,
  Tall = 5,
  TallAndMuscular = 6,
  ShortAndLean = 7,
  Short = 8,
  ShortAndMuscular = 9,
  Messi = 10,
  VeryTallAndLean = 11,
  Akinfenwa = 12,
  Courtois = 13,
  Neymar = 14,
  Shaqiri = 15,
  Ronaldo = 16,
  Unused = 17,
  Leroux = 18,
  Salah = 25,
  Manager1 = 81,
  Manager2 = 82,
  Manager3 = 83,
  Manager4 = 84,
  Manager5 = 85,
  Manager6 = 86,
  Manager7 = 87,
  Manager8 = 88,
  Manager9 = 89,
  Morgan = 127
}

export enum EyeBrowCode {
  Normal = 0,
  Big = 1,
  Thin = 2,
  Female1 = 3,
  Female2 = 4,
  Female3 = 5,
  Female4 = 6
}

export enum EyeColorCode {
  DarkBlue = 0,
  LightBlue = 1,
  DarkBrown = 2,
  LightBrown = 3,
  BrownGreen = 4,
  DarkGreen = 5,
  LightGreen = 6,
  Gray = 7,
  Black = 8,
  DarkGray = 9,
  Unknown = 10
}

export enum FacialHairColorCode {
  Black = 0,
  Blonde = 1,
  DarkBrown = 2,
  LightBrown = 3,
  Red = 4
}

export enum FacialHairTypeCode {
  None = 0,
  ChinStubbleLight = 1,
  ChinStrap = 2,
  Goatee = 3,
  CasualBeard = 4,
  PartialGoatee = 5,
  Stubble = 6,
  Tuft = 7,
  FullBeard = 8,
  LightGoatee = 9,
  Mustache = 10,
  LightChinCurtain = 11,
  FullGoatee = 12,
  ChinCurtain = 13,
  Beard = 14,
  PatchyBeard = 15,
  Unknown1 = 16,
  Unknown2 = 17
}

export enum HairColorCodeCode {
  Blonde = 0,
  Black = 1,
  AshBlonde = 2,
  DarkBrown = 3,
  PlatinumBlonde = 4,
  LightBrown = 5,
  Brown = 6,
  Red = 7,
  White = 8,
  Gray = 9,
  Green = 10,
  Violet = 11,
  IntenseRed = 12,
  Unknown1 = 13
}

export enum SkinTypeCode {
  Clean = 0,
  Feckled = 1,
  Rough = 2,
  Female1 = 3,
  Female2 = 4,
  Female3 = 5,
  Female4 = 6,
  Female5 = 7,
  Unknown1 = 50,
  Unknown2 = 51,
  Unknown3 = 100,
  Unknown4 = 101,
  Unknown5 = 102,
  Unknown6 = 103,
  Unknown7 = 104,
  Unknown8 = 150
}

export enum SkinToneCode {
  Pink = 2,
  LightYellow = 4,
  MediumYellow = 5,
  DarkYellow = 6,
  LightBrown = 8,
  MediumBrown = 9,
  DarkBrown = 10
}

export enum SideburnsCode {
  None = 0,
  Short = 1,
  Long = 2,
  Unused = 3
}

export interface Person {
  bodytypecode: BodyTypeCode;
  eyebrowcode: EyeBrowCode;
  eyecolorcode: EyeColorCode;
  facialhaircolorcode: FacialHairColorCode;
  facialhairtypecode: FacialHairTypeCode;
  gender?: Gender;
  haircolorcode: HairColorCodeCode;
  hairtypecode: number;
  headclasscode: HeadClassCode;
  headtypecode: number;
  sideburnscode: SideburnsCode;
  skintonecode: SkinToneCode;
  skintypecode: SkinTypeCode;
}

export enum PersonAttribute {
  BodyTypeCode = 'bodytypecode',
  EyeBrowCode = 'eyebrowcode',
  EyeColorCode = 'eyecolorcode',
  FacialHairColorCode = 'facialhaircolorcode',
  FacialHairTypeCode = 'facialhairtypecode',
  HairColorCode = 'haircolorcode',
  HairTypeCode = 'hairtypecode',
  HeadTypeCode = 'headtypecode',
  SideburnsCode = 'sideburnscode',
  SkinToneCode = 'skintonecode',
  SkinTypeCode = 'skintypecode'
}

export interface AttributeByGender {
  man: KeyValueFrequency;
  woman: KeyValueFrequency;
}

export type AttributeGender = 'man' | 'woman';
