"use strict";
class MyEnum {
    constructor(cityList,Distance,isStart,isEnd,isSeE) {
        this.ocl = cityList //original city list 城市列表
        this.cn = cityList.length // 城市列表的长度
        this.arrangementList = []
        this.flag = []
        this.result = []
        this.Ghh = []

        for (var i = 0; i < this.cn; i++) {
            this.flag[i] = 0;
            this.result[i] = i;
        }
        for (var i = 0; i < this.cn; i++) {
            this.Ghh[i] = i;
        } 
        this.Distance = Distance //距离矩阵
        // 必须在使用evaluate函数之前初始化 距离数组
        // this.initDistance(this.ocl)

        
        // 1.有起点有终点,默认终点和起点不一样
        // 2.有终点肯定有起点
        // 111 01X 情况不存在
        this.isStart = isStart;// 0没起点 1有起点
        this.isEnd = isEnd; // 0没终点 1有终点
        this.isSeE = isSeE;

        this.bestGhh = this.Ghh
        // evaluate 依赖this.isSeE 必须在 this.isSeE赋值之后
        this.bestEvaluate = this.evaluate(this.bestGhh)
        
    }

    //js实现全排列
    arrange(step) {
        //边界判断条件
        if (step == this.cn - this.isEnd) {
            var tmpArr = [];

            for (var i = this.isStart; i < this.cn - this.isEnd; i++) {
                tmpArr[i] = this.Ghh[this.result[i]];  
            }
            if(this.isStart){
                tmpArr[0] = this.Ghh[0];
            }
            if(this.isEnd){
                tmpArr[this.cn-1] = this.Ghh[this.cn-1];
            }
            // 如果temArr的花费比bestGhh,则为bestGhh重新赋值
            if(this.evaluate(tmpArr) < this.evaluate(this.bestGhh)){
                this.bestGhh = tmpArr
                this.bestEvaluate = this.evaluate(this.bestGhh)
            }
            this.arrangementList.push(tmpArr);
        } else if (step < this.cn - this.isEnd) {
            //递归
            for (var i = this.isStart; i < this.cn - this.isEnd; i++) {
                if (this.flag[i] == 0) {
                    this.result[step] = i;
                    this.flag[i] = 1;
                    this.arrange(step + 1);
                    this.flag[i] = 0;
                }
            }
        }
    }
    // 运行
    run() {
        this.arrange(this.isStart);
        console.log("共计算" +this.arrangementList.length+ "次");
        // for (var i = 0; i <this.arrangementList.length; i++) {
        //     console.log(this.arrangementList[i]);
        // }
        console.log('最好路径'+this.bestGhh)
        console.log('花费:'+this.bestEvaluate)
    }
    // 评价函数
    evaluate(Ghh){
        var result = 0;
        for(var i = 0;i < this.cn - 1 + this.isSeE ;i++){
            if(this.isSeE && i == this.cn-1){ //是否回到起点
                result += this.Distance[Ghh[i]][Ghh[0]]
            }
            else{
                result += this.Distance[Ghh[i]][Ghh[i+1]]
            }    
        }
        return result;
    }
    // 初始化 城市距离数组
    initDistance(cityList) {
        var Distance = new Array()
        for (var i = 0; i < cityList.length; i++) {
            var Distance2 = new Array()
            for (var k = 0; k < cityList.length; k++) {
                if (i == k) {
                    Distance2[k] = 0;
                }
                else {
                    Distance2[k] = this.calcDistance(cityList[i], cityList[k])
                }
            }
            Distance[i] = Distance2
        }
        this.Distance = Distance
    }

    calcDistance(cityA, cityB) {
        var x = Math.abs(cityA[0] - cityB[0]) //x轴距离
        var y = Math.abs(cityA[1] - cityB[1]) //y轴距离
        return Math.sqrt(x * x + y * y)
    }
}

export default MyEnum