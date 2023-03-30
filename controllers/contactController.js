const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModels")

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  console.log(req.user.id)
    const contacts = await Contact.find({user_id : req.user.id});
    res.status(200).json(contacts)
});

//@desc Create New contacts
//@route Post /api/contacts
//@access private
const createContact = asyncHandler(async (req , res) => {

    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  // console.log(req.user.id)
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id
  })
    res.status(200).json(contact)
});

//@desc get contact
//@route get /api/contacts/:id
//@access private
const getContact =asyncHandler (async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }
    res.status(200).json(contact)
});

//@desc Update contacts
//@route put /api/contacts
//@access private
const updateContact =asyncHandler(async (req , res) => {
    const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete other user contacts");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
    res.status(200).json(updatedContact)
})

//@desc Delete contacts
//@route Delete /api/contacts
//@access private
const deleteContact = asyncHandler(async (req , res) => {
    const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
    if (contact.user_id.toString() !== req.user.id) {
      res.status(403);
      throw new Error("User don't have permission to update other user contacts");
    }
  }
  await Contact.findByIdAndRemove(req.params.id);
  res.status(200).json(contact)
})

module.exports = {getContact , createContact , updateContact , deleteContact , getContacts}