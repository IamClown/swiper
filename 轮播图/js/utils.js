(function () {
    let Utils = function (curEle) {
        this.curEle = curEle;
    };
    let reg = /^(width|height|opacity|left|right|bottom|top|margin|padding)$/
    Utils.prototype = {
        constructor: Utils,
        getCss: function (attr) {
            let curEle = this.curEle;
            let value = null;
            if ("getComputedStyle" in window) {
                value = getComputedStyle(curEle)[attr];
            } else {
                value = curEle.currentStyle[attr];
            }
            if (reg.test(attr)) {
                if (!isNaN(parseFloat(value))) {
                    return parseFloat(value);
                }
            } else {
                return value;
            }
        },
        setCss: function (attr, value) {
            let curEle = this.curEle;
            if (reg.test(attr)) {
                //value是否为number类型的
                if (attr === 'opacity') {
                    curEle.style[attr] = value;
                }
                if (typeof value === "number") {
                    curEle.style[attr] = value + "px";
                }
            } else {
                curEle.style[attr] = value;
            }
        },
        setGroupCss: function (obj) {
            let curEle = this.curEle;
            for (let key in obj) {
                utils(curEle).setCss(key, obj[key]);
            }
        },
        css: function (...arg) {
            let ele = this.ele;
            switch (arg.length) {
                case 1:
                    switch (Object.prototype.toString.call(...arg)) {
                        case "[object String]":
                            return utils(ele).getCss(...arg);
                        case "[object Object]":
                            utils(ele).setGroupCss(...arg);
                    }
                case 2:
                    utils(ele).setCss(...arg);
                    break;
            }
        },
        offset: function () {
            let curEle = this.curEle;
            let left = curEle.offsetLeft;
            let top = curEle.offsetTop;
            let parent = curEle.offsetParent;
            while (parent !== document.body) {
                left += parent.clientLeft + parent.offsetLeft;
                top += parent.clientTop + parent.offsetTop;
                parent = parent.offsetParent;
            }
            return {
                left, top
            }
        },
        win: function (attr, value) {
            if (value === undefined) {
                //获取样式
                return document.documentElement[attr] || document.body[attr];
            } else {
                document.documentElement[attr] = value;
                document.body[attr] = value;
            }
        },
        fadeIn: function () {
            let curEle = this.curEle;
            let temp = 0.3;
            curEle.timer ? clearInterval(curEle.timer) : null;
            utils(curEle).setCss("opacity", temp);
            curEle.timer = setInterval(function () {
                temp += 0.1;
                console.log(curEle)
                utils(curEle).setCss("opacity", temp);
                if (temp >= 1) {
                    clearInterval(curEle.timer);
                    utils(curEle).setCss("opacity", 1);
                }
            }, 20)
        },
        animate: function (target, duration, callBack) {
            let curEle = this.curEle;
            // curEle.timer ? clearInterval(curEle.timer) : null;
            if (curEle.timer) {
                clearInterval(curEle.timer);
            }
            //获取开始位置和变化的位置
            let change = {};
            let begin = {};
            for (let key in target) {
                begin[key] = utils(curEle).getCss(key);
                change[key] = target[key] - begin[key];
            }
            let interval = 0;

            curEle.timer = setInterval(function () {
                interval += 17;
                if (interval >= duration) {
                    clearInterval(curEle.timer);
                    utils(curEle).setGroupCss(target);
                    typeof callBack === "function" ? callBack() : null;
                    return;
                }
                for (let key in target) {
                    let step = utils.linear(interval, begin[key], change[key], duration);
                    utils(curEle).setCss(key, step);
                }
            }, 17)
        }
    };
    let utils = curEle => new Utils(curEle);
    utils.ajax = (method, url, async) => {
        let xhr = new XMLHttpRequest(),
            data = null;
        xhr.open(method, url, async);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                data = window.JSON.parse(xhr.responseText);
            }
        };
        xhr.send(null);
        return data;
    };
    utils.toArray = (arrayLike) => {
        try {
            return [].slice.call(arrayLike);
        } catch (e) {
            let newAry = [];
            for (let i = 0; i < arrayLike.length; i++) {
                newAry[i] = arrayLike[i];
            }
            return newAry;
        }
    }
    //匀速运动公式
    utils.linear = (t, b, c, d) => {
        return t / d * c + b;
    };
    window.utils = utils;
})();