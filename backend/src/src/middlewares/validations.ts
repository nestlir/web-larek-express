import { celebrate, Joi, Segments } from 'celebrate';

// Валидация для создания продукта
export const validateProductBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля "title" - 2',
        'string.max': 'Максимальная длина поля "title" - 30',
        'any.required': 'Поле "title" должно быть заполнено',
      }),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
    category: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    price: Joi.number().allow(null),
  }),
});

// Валидация для обновления продукта
export const validateProductUpdateBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30),
    image: Joi.object().keys({
      fileName: Joi.string(),
      originalName: Joi.string(),
    }),
    category: Joi.string(),
    description: Joi.string().allow(null, ''),
    price: Joi.number().allow(null),
  }),
});

// Валидация ID из параметров URL
export const validateObjId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    productId: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'ID должен быть в формате hex',
        'string.length': 'Длина ID должна быть 24 символа',
      }),
  }),
});

// Валидация для создания заказа
export const validateOrderBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    items: Joi.array().items(Joi.string().hex().length(24).required()).min(1).required()
      .messages({
        'array.min': 'Список товаров не может быть пустым',
        'string.hex': 'ID товара должен быть в формате hex',
        'string.length': 'Длина ID товара должна быть 24 символа',
      }),
    total: Joi.number().required().messages({
      'any.required': 'Поле "total" должно быть заполнено',
    }),
    payment: Joi.string().valid('card', 'online').required()
      .messages({
        'any.only': 'Поле "payment" должно быть "card" или "online"',
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Неверный формат email',
        'any.required': 'Поле "email" должно быть заполнено',
      }),
    phone: Joi.string().required()
      .messages({
        'any.required': 'Поле "phone" должно быть заполнено',
      }),
    address: Joi.string().required()
      .messages({
        'any.required': 'Поле "address" должно быть заполнено',
      }),
  }),
});
