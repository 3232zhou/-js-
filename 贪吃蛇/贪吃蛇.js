
//食物的自调用函数
(function () {
    var elem = []; //保存每一个小方块的食物
    function food(width,height,color, x, y) {
        this.width = width || 20;
        this.height = height || 20;
        this.color = color || "red";
        //做标
        this.x = x || 0;
        this.y = y || 0;
    }
    //为原型添加初始化的方法(作用：在页面上显示这个食物)
    food.prototype.init = function(box){
        remove();
        //因为食物要在地图上显示，所以需要地图这个参数(map就是div box)
        //创建div
        var div = document.createElement("div");
        //添加到box中
        box.appendChild(div);
        //设置div样式
        div.style.width =this.width + "px";
        div.style.height =this.height + "px";
        div.style.backgroundColor = this.color;

        div.style.position = "absolute";
        //横纵坐标
        this.x = parseInt(Math.random()*(box.offsetWidth / this.width))*this.width;
        this.y = parseInt(Math.random()*(box.offsetHeight / this.height))*this.height;
        div.style.left = this.x + "px";
        div.style.top = this.y + "px";

        elem.push(div);


    };


    //私有的函数，remove
    function remove() {
        for (var i=0; i < elem.length; i++){
            var ele = elem[i];
            //找到这个子元素的父级元素，然后删除这个子元素
            ele.parentNode.removeChild(ele);
            //再次把elem中的这个子元素也要删除
            elem.splice(i, 1);
        }
    }
    window.food = food; //把food暴露给window，变成全局
}());

//小蛇的自调用函数
(function () {
    var element = [];//存放小蛇的身体每个部分
    function snake(width, height, direction) {
        this.width = width || 20;
        this.height = height || 20;

        //身体
        this.body = [
            {x:3, y:2, color:"red"},  //头
            {x:2, y:2, color:"orange"}, //身体
            {x:1, y:2, color:"orange"}, //身体
        ];
        //方向
        this.direction = direction || "right";
    }
    //小蛇的初始化
    snake.prototype.init = function (box) {
        remove();
        for (var i = 0; i < this.body.length; i++){
            var obj = this.body[i];
            var div = document.createElement("div");
            box.appendChild(div);
            //设置div样式
            div.style.position = "absolute";
            div.style.width =this.width + "px";
            div.style.height =this.height + "px";
            //坐标
            div.style.left = obj.x * this.width+ "px";
            div.style.top = obj.y * this.height+ "px";
            div.style.backgroundColor  = obj.color;
            element.push(div)
        }
    };

    //为原型添加方法----小蛇动起来
    snake.prototype.move = function (food, box){
        var i = this.body.length - 1; //2
        for (; i>0; i--){
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }
        //判断方向---改变小蛇头的坐标
        switch (this.direction) {
            case "right":
                this.body[0].x+=1;
                break;
            case "left":
                this.body[0].x-=1;
                break;
            case "top":
                this.body[0].y-=1;
                break;
            case "bottom":
                this.body[0].y+=1;
                break;
        }
    };

    //删除小蛇的私有函数
    function remove(){
        //获取数组
        var i = element.length - 1;
        for (; i >= 0; i--){
            //先从当前的子元素中找到该子元素的父亲元素，然后在弄死这个子元素
            var ele = element[i];
            //从地图上面删除这个子元素div
            ele.parentNode.removeChild(ele);
            element.splice(i, 1);
        }
    }


    window.snake = snake;
}());

//自动用函数---游戏对象
(function (){
    //游戏的构造函数
    var that = null;
    function Game(box) {
        //this时Game的实例对象
        this.Food = new food();
        this.Snake = new snake();
        this.box  = box;
        that = this;
    }


    Game.prototype.init = function () {
        //食物初始化
        this.Food.init(this.box);
        //小蛇初始化
        this.Snake.init(this.box);
        this.run(this.food, this.box);
        //调用判断按键
        this.nameKey()
        //这行代码后面不在这里写，尽可能的保存一个方法做一件事
        // setInterval( function () {
        //     that.Snake.move(that.Food, that.Snake);
        //     that.Snake.init(that.box)
        // },150);

    };

    //添加原型方法--设置小蛇可以自己爬起来
    Game.prototype.run = function (food, box) {
        //自动移动
        var time = setInterval(function () {
            //此时的this时window
            //移动小蛇
            this.Snake.move(food, box);
            //初始化小蛇
            this.Snake.init(box);
            //横坐标的最大值
            var MaxX = box.offsetWidth/this.Snake.width;
            //纵坐标的最大值
            var MinY = box.offsetHeight/this.Snake.height;
            //小蛇的头坐标
            var headX = this.Snake.body[0].x;
            var headY = this.Snake.body[0].y;
            console.log(headY);
            if (headX<0 || headX >= MaxX){
                //撞墙了,停止计时器
                clearInterval(time);
                alert("游戏结束")

            }
            if (headY < 0 || headY >= MinY){
                clearInterval(time);
                alert("游戏结束")
            }
        }.bind(that), 150);  //bind改变的时this的指向

    };

    //添加原型方法--判断用户按下的键盘
    Game.prototype.nameKey = function () {
        //获取用户按下的按键
        //这里的this时keydown的事件对象===document，所以这里的this是document
        document.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 37:this.Snake.direction = "left"; break;
                case 38:this.Snake.direction = "top"; break;
                case 39:this.Snake.direction = "right"; break;
                case 40:this.Snake.direction = "bottom"; break;
            }
        }.bind(that), false)
    };



     window.Game = Game;
}());
//键盘按下事件
// document.onkeydown = function (event) {
//     var e = event || window.event || arguments.callee.caller.arguments[0];
//     if (e && e.keyCode == 87){
//         console.log("w")
//     }
//     if (e && e.keyCode == 83){
//         console.log("s")
//     }
//     if (e && e.keyCode == 65){
//         console.log("a")
//     }
//     if (e && e.keyCode == 68){
//         console.log("d")
//     }
// };

var gm = new Game(document.querySelector(".box"));
gm.init();