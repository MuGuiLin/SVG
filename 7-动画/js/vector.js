(function () {
    // 向量类
    function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    // 静态方法：从两个点创建矢量
    Vector.fromPoints = function (p1, p2) {
        return new Vector(p2.x - p1.x, p2.y - p1.y);
    };

    // 实例方法
    Vector.prototype = {
        constructor: Vector,
        // 正方形
        square: function () {
            return this.x * this.x + this.y * this.y;
        },
        // 矢量长度
        length: function () {
            return Math.sqrt(this.square());
        },

        // 加矢量
        add: function (q) {
            return new Vector(this.x + q.x, this.y + q.y);
        },

        // 减矢量
        minus: function (q) {
            return new Vector(this.x - q.x, this.y - q.y);
        },

        // 乘标量
        multipy: function (scale) {
            return new Vector(this.x * scale, this.y * scale);
        },

        // 求单位矢量
        normalize: function (length) {
            if (length === undefined || !length) {
                length = 1;
            }
            return this.multipy(length / this.length());
        }
    };

    window.Vector = Vector;
})();