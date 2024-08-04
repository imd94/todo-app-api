const apiRouter = require('express').Router();
const itemController = require('./controllers/itemController');
const cors = require('cors');

apiRouter.use(cors());

apiRouter.get("/", (req, res) => res.json("Hello, if you see this message that means your backend is up and running successfully."))
apiRouter.get('/active-items-count', itemController.apiGetActiveItemsCount);
apiRouter.post('/items', itemController.apiGetItems);
apiRouter.post('/create-item', itemController.apiCreateItem);
apiRouter.post('/update-item', itemController.apiUpdateItem);
apiRouter.post('/update-item-status', itemController.apiUpdateItemStatus);
apiRouter.post('/delete-item', itemController.apiDeleteItem);
apiRouter.post('/delete-completed-items', itemController.apiDeleteCompletedItems);

module.exports = apiRouter;