const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const Joi = require("joi");

const router = express.Router();

const newContactShema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
}).required();

const updatedContactShema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
})
  .min(1)
  .required();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({
      code: 200,
      data: {
        result: contacts,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    console.log(contactId);
    const contact = await getContactById(contactId);
    if (!contact) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
    res.json({
      code: 200,
      data: {
        result: contact,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = newContactShema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const newContact = await addContact(req.body);

    res.status(201).json({
      message: "Contact has been added",
      code: 201,
      data: {
        result: newContact,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await removeContact(contactId);
    if (!deletedContact) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
    res.json({
      message: "Contact has been deleted",
      code: 200,
      data: {
        result: deletedContact,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = updatedContactShema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);

    if (!updatedContact) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
    res.json({
      message: "Contact has been updated",
      status: 200,
      data: {
        result: updatedContact,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
