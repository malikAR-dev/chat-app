import Joi from "joi";

export const createUserValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    mobileNumber: Joi.string().required(),
  }).validate(data);

export const loginUserValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).validate(data);

export const roomIdValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    roomId: Joi.number().required(),
  }).validate(data);

export const createRoomValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }).validate(data);

export const createRoomChatValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    chatType: Joi.string().valid("Room Chat").required(),
    message: Joi.string().required(),
  }).validate(data);

export const createPersonalChatValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    chatType: Joi.string().valid("Personal Chat").required(),
    message: Joi.string().required(),
  }).validate(data);

export const roomAndUserIdValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    roomId: Joi.number().required(),
    userId: Joi.number().required(),
  }).validate(data);
