const Item = require('../models/Item');

exports.apiCreateItem = async function(req, res) {
    const item = new Item(req.body);

    try {
        const itemInfo = await item.createItem();
        if(itemInfo.errors?.length) {
            res.json(itemInfo.errors);
        } else {
            res.json(itemInfo);
        }
    } catch(errors) {
        console.log(errors);
    }
}

exports.apiGetItems = async function(req, res) {
    try {
        const items = await Item.getItems(req.body.category);
        res.json(items);
    } catch(errors) {
        console.log(errors);
    }
}

exports.apiUpdateItem = async function(req, res) {
    const item = new Item(req.body, req.body.id);

    try {
        const responseMessage = await item.updateItem();

        if(responseMessage === 'success') {
            res.json(responseMessage);
        } else {
            res.json(false);
        }
    } catch(errors) {
        console.log(errors);
    }
}

exports.apiUpdateItemStatus = async function(req, res) {
    const item = new Item(req.body, req.body.id);

    try {
        const responseMessage = await item.updateItemStatus();

        if(responseMessage === 'success') {
            res.json(responseMessage);
        } else {
            res.json(false);
        }
    } catch(errors) {
        console.log(errors);
    }
}

exports.apiDeleteItem = async function(req, res) {
    const item = new Item(req.body, req.body.id);

    try {
        const responseMessage = await item.deleteItem();

        if(responseMessage === 'success') {
            res.json('Item was successfully deleted from the database!');
        } else {
            res.json(false);
        }
    } catch(errors) {
        console.log(errors);
    }
}

exports.apiDeleteCompletedItems = async function(req, res) {
    try {
        const response = await Item.deleteCompletedItems();

        if(response === 'Success') {
            res.json('Completed items has been deleted successfully!');
        } else {
            res.json(response.warning);
        }
    } catch(errors) {
        console.log(errors);
    }
}

exports.apiGetActiveItemsCount = async function(req, res) {
    try {
        const activeItemsCount = await Item.countActiveItems();

        if(activeItemsCount) {
            res.json(activeItemsCount);
        } else {
            res.json(0);
        }
    } catch(errors) {
        console.log(errors);
    }
}