module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

//ADD TO CART
    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item:item, qty: 0, BOOK_PRICE:0};
            storedItem.BOOK_PRICE = storedItem.item.BOOK_PRICE;
        this.totalQty++;
        this.totalPrice += storedItem.BOOK_PRICE;
        storedItem.qty++;
        }
        
        
    } 
    
//ADD SELECTED BOOK
    this.addSelected = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item:item, qty: 0, BOOK_PRICE:0};
        }
        storedItem.BOOK_PRICE = storedItem.item.BOOK_PRICE * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.BOOK_PRICE;
    } 

//REDUCE BOOK QUANTITY
    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].BOOK_PRICE -= this.items[id].item.BOOK_PRICE;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.BOOK_PRICE;
    
        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
   
    }

//ADD BOOK QUANTITY
    this.addByOne = function(id) {
        this.items[id].qty++;
        this.items[id].BOOK_PRICE += this.items[id].item.BOOK_PRICE;
        this.totalQty++;
        this.totalPrice += this.items[id].item.BOOK_PRICE;
    
        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
   
    }

//REMOVE ITEM FROM THE CART
    this.removeItem = function(id) {
        if (this.totalQty <= 1) {
            this.totalQty -= this.items[id].qty;
            delete this.items[id];
            this.totalPrice = 0
        }
        else {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].BOOK_PRICE;
        delete this.items[id];
        }
    }

//ARRAY OF CART ITEMS
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
}