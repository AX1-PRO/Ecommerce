import { check,body } from "express-validator";
import { msgValidator } from "./errorMsgexpressValidator.js";
import { couponModel } from "../../models/couponModel.js";

let createcouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required")
    .custom(async (val) => {
      let coupon = await couponModel.findOne({ name: val });
      if (coupon) {
        throw new Error("Coupon already exists");
      }
      return true;
    }),

  check("discount")
    .notEmpty()
    .withMessage("Discount is required")
    .isInt({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),

  check("expier")
    .notEmpty()
    .withMessage("Expiration date is required")
    .isISO8601()
    .withMessage("Expiration date must be a valid date"),
  msgValidator
];
export {createcouponValidator}
