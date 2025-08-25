import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { searchContacts,getContactsforDMList } from "../controllers/contact.controller.js";


const contactRouter = Router();
contactRouter.post("/search", verifyToken, searchContacts);
contactRouter.get("/get-contacts-for-dm-list", verifyToken, getContactsforDMList);
export default contactRouter;