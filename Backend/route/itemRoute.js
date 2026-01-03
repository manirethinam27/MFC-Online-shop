import express from 'express';
import { createItem,getAllItems,updateItem,deleteItem } from '../controller/itemController.js';

const itemRouter = express.Router();

itemRouter.post('/createitem', createItem);
itemRouter.get('/getitems', getAllItems);
itemRouter.put('/updateitem/:itemId', updateItem);
itemRouter.delete('/deleteitem/:itemId', deleteItem);

export default itemRouter;