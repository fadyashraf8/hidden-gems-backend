import Joi from "joi";

export const gemSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  gemLocation: Joi.string().required(),
  gemPhone: Joi.string()
    .pattern(/^01[0-2,5][0-9]{8}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Egyptian number (e.g. 01012345678).",
      "string.empty": "Phone number is required.",
    })
    .optional(),

  description: Joi.string().min(10).required(),
  category: Joi.string().hex().length(24).required(),
  discount: Joi.number().min(0).max(100).optional(),
  discountGold: Joi.number().min(0).max(90).optional(),
  discountPlatinum: Joi.number().min(0).max(100).optional(),
  status: Joi.string().valid("pending", "rejected", "accepted").optional(),
  avgRating: Joi.number().min(0).max(5).optional(),
  isSubscribed: Joi.boolean().optional(),
});

export const gemUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  oldImages: Joi.array().items(Joi.string()).optional(),
  gemLocation: Joi.string().optional(),
  description: Joi.string().min(10).optional(),
  gemPhone: Joi.string()
    .pattern(/^01[0-2,5][0-9]{8}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Egyptian number (e.g. 01012345678).",
      "string.empty": "Phone number is required.",
    })
    .optional(),
  category: Joi.string().hex().length(24).optional(),
  discount: Joi.number().min(0).max(100).optional(),
  discountGold: Joi.number().min(0).max(90).optional(),
  discountPlatinum: Joi.number().min(0).max(100).optional(),
  status: Joi.string().valid("pending", "rejected", "accepted").optional(),
  avgRating: Joi.number().min(0).max(5).optional(),
  isSubscribed: Joi.boolean().optional(),
});
