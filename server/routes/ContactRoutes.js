import express from "express";
import ContactsController from "../controllers/ContacsControllers.js";

const router = express.Router();

router.get("/getAllContacts", ContactsController.getAllContacts.bind(ContactsController));
router.post("/searchContacts", ContactsController.searchContacts.bind(ContactsController));
router.get("/getContactsForList", ContactsController.getContactsForList.bind(ContactsController));

export default router;
