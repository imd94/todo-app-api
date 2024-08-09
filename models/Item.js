const db = require("../db");

let Item = function(data, itemId) {
    this.data = data;
    this.itemId = itemId;
    this.errors = [];
}

Item.prototype.cleanUp = function() {
    if(typeof(this.data.item_description) != 'string') { this.data.item_description = ''; }
    if(typeof(this.itemId) != 'number') { this.itemId = ''; }

    function leadingZero(x) {
        if (x < 10) {
            return "0" + x;
        } else {
            return x;
        }
    }

    let date = new Date();
    let day = leadingZero(date.getDate());
    let hours = leadingZero(date.getHours());
    let minutes = leadingZero(date.getMinutes());
    let seconds = leadingZero(date.getSeconds());
    let month = leadingZero(date.getMonth() + 1);
    fullDate = `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    this.data = {
        item_description: this.data.item_description.trim(),
        created_date: fullDate,
        completed: this.data.completed
    }
}

Item.prototype.validate = function() {
    if(this.data.item_description == '') {
        this.errors.push(`You must provide an item description!`);
    }

    if(this.data.item_description.length > 50) {
        this.errors.push(`Todo item description can't exceed 50 characters!`);
    }

    return;
}

Item.prototype.createItem = async function() {
    this.cleanUp();
    this.validate();

    if(!this.errors.length) {
        try {
            const [{ insertId }] = await db.execute("INSERT INTO `todo_items` (`description`, `created_date`, `completed`) VALUES(?, ?, ?)", [this.data.item_description, this.data.created_date, this.data.completed]);
            return insertId;
        } catch(e) {
            console.log('Connection to db failed!', e);
        }
    } else {
        return { errors: this.errors };
    }
}

Item.getItems = async function(category) {
    try {
        let query = "";
        let queryArg = "";

        if(category === 'category--active') {
            query = "SELECT * FROM `todo_items` WHERE `completed` = ? ORDER BY `created_date` DESC";
            queryArg = 0;
        } else if(category === 'category--completed') {
            query = "SELECT * FROM `todo_items` WHERE `completed` = ? ORDER BY `created_date` DESC";
            queryArg = 1;
        } else {
            query = "SELECT * FROM `todo_items` ORDER BY `created_date` DESC";
        }
        
        const [ items ] = await db.execute(query, [queryArg]);

        if(items.length) {
            return items;
        } else {
            return false;
        }
    } catch(e) {
        console.log('Connection to db failed!', e);
    }
}

Item.countActiveItems = async function() {
    try {
        const [[{ activeItemsCount }]] = await db.execute("SELECT COUNT(`id`) as 'activeItemsCount' FROM `todo_items` WHERE `completed` = ?", [0]);

        if(activeItemsCount) {
            return activeItemsCount;
        } else {
            return false;
        }
    } catch(e) {
        console.log('Connection to db failed!', e); 
    }
}

Item.prototype.updateItem = async function() {
    this.cleanUp();
    this.validate();

    if(!this.errors.length) {
        try {
            await db.execute("UPDATE `todo_items` SET `description` = ?, `completed` = ? WHERE `id` = ?", [this.data.item_description, this.data.completed, this.itemId]);

            return 'success';
        } catch(e) {
            console.log('Connection to db failed!', e); 
        }
    } else {
        return { errors: this.errors };
    }
}

Item.prototype.updateItemStatus = async function() {
    this.cleanUp();

    try {
        await db.execute("UPDATE `todo_items` SET `completed` = ? WHERE `id` = ?", [this.data.completed, this.itemId]);

        return 'success';
    } catch(e) {
        console.log('Connection to db failed!', e); 
    }
}

Item.prototype.deleteItem = async function() {
    this.cleanUp();

    try {
        await db.execute("DELETE FROM `todo_items` WHERE `id` = ?", [this.itemId]);
        return 'success';
    } catch(e) {
        console.log('Connection to db failed!', e); 
    }
}

Item.deleteCompletedItems = async function() {
    try {
        const response = await Item.findAllCompletedItems();

        if(response === 'success') {
            await db.execute("DELETE FROM `todo_items` WHERE `completed` = ?", [1]);
            return 'Success';
        } else {
            return { warning: 'There are no completed items in database currently!' };
        }
    } catch(e) {
        console.log('Connection to db failed!', e); 
    }
}

Item.findAllCompletedItems = async function() {
    try {
        const [ completedItems ] = await db.execute("SELECT * FROM `todo_items` WHERE `completed` = ?", [1]);

        if(completedItems.length) {
            return 'success';
        } else {
            return false;
        }
    } catch(e) {
        console.log('Connection to db failed!', e); 
    }
}

module.exports = Item;