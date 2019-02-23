//获取操作的元素
let outer = document.getElementById("outer"),
    switer = document.getElementsByClassName("switer")[0],
    oUl = document.getElementById("focus"),
    oLis = document.getElementsByTagName("li"),
    btnLeft = document.getElementById("left"),
    btnRight = document.getElementById("right"),
    switerTemp = document.getElementsByClassName("switerTemp")[0],
    oDivs = switer.getElementsByTagName("div");
//通过ajax获取数据
let data = utils.ajax("get", "json/banner.json", false, "json");
// 渲染数据
let bind_data = (data) => {
    for (let i = 0; i < data.length; i++) {
        let { img, desc } = data[i];
        let temp = switerTemp.innerHTML;
        temp = temp.replace("#img#", `${img}`);
        temp = temp.replace("#desc#", `${desc}`);
        let div = document.createElement("div");
        div.innerHTML = temp;
        switer.appendChild(div);
        let li = document.createElement("li");
        oUl.appendChild(li);
    }
    //实现无缝滚动
    switer.appendChild(oDivs[0].cloneNode(true));
    switer.insertBefore(oDivs[oDivs.length - 2].cloneNode(true), oDivs[0]);
    //

}
bind_data(data);
//定义一个和图片索引对应的值
; (function () {
    let step = 1;//因为默认显示第一张，所以是1
    //默认第一个小圆点高亮
    oLis[0].classList.add("select");
    //自动轮播
    let timer = setInterval(autoMove, 2000);
    //获取一张图片的宽度
    let imgW = oDivs[0].offsetWidth;
    //定时器的回调函数
    function autoMove() {
        step++;//循环下一张
        if (step === oDivs.length) {//临界条件当最后一张图片加载完事，瞬间setp=1，绝对不能等于1，否则就会在第一张图片上多停留一段时间
            //设置容器的位置瞬间到索引为1的那张图片
            utils(switer).setCss("left", -800);
            step = 2;
        }
        utils(switer).animate({ left: -imgW * step }, 300);
        renderPagenation(step - 1);
    }
    function renderPagenation(step) {
        //分页器切换
        for (let i = 0; i < oLis.length; i++) {
            //清除所有小圆点的样式
            oLis[i].classList.remove("select");
            if (step === i) {
                oLis[step].classList.add("select");
            }
            if (step === -1) {
                oLis[oLis.length - 1].classList.add("select");
            }
            if (step === 4) {
                oLis[0].classList.add("select");
            }
        }
    }
    //给分页器添加点击事件
    for (let k = 0; k < oLis.length; k++) {
        oLis[k].onclick = () => {
            step = k + 1;
            utils(switer).animate({ left: -imgW * step }, 300);
            renderPagenation(k);
        }
    }
    //给左右两边的按钮添加点击事件
    btnLeft.onclick = () => {
        step--;
        if (step === -1) {
            step = 3;
            utils(switer).setCss("left", -3200);
        }
        renderPagenation(step - 1);
        utils(switer).animate({ left: -imgW * step }, 300);
    }
    btnRight.onclick = () => {
        autoMove();
    }
    //鼠标划上清除定时器
    outer.onmouseover = () => {
        clearInterval(timer);
    }
    //鼠标移除设置定时器
    outer.onmouseout = () => {
        timer = setInterval(autoMove, 2000);
    }
})()

