var random = {
    fromArray: function(array) {
        const min = 0;
        return array[Math.floor(Math.random() * (array.length - min)) + min];
    }
}