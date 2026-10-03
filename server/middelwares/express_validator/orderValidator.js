import { msgValidator } from "./errorMsgexpressValidator.js";
import { param } from "express-validator";

let createOrderValidator = [
    param("cartid")
        .isMongoId()
        .withMessage("cart id is not valid"),

    msgValidator
];

export { createOrderValidator };
