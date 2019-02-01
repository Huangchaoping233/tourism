"use strict";
class SAA{
    constructor(ocl,N,t0,isStart,isEnd,isSeE){
        this.cn = ocl.length //city number城市数量
        this.N = N //每个温度迭代步长
        console.log(this.N)
        this.Tcool = 0 //降温次数
        // this.a = a //降温系数
        this.k = 0//迭代次数
        this.t0 = t0 //初始温度
        this.T = t0 //温度
        this.ocl = ocl //original city list最开始的城市列表
        this.K = 0.95 //K为玻尔兹曼常数
        // this.cityList = [
        //     [2,5],[1,5],[6,2],[3,8]
        // ]
        this.Ghh = new Array() 
        this.isStart = isStart;// 0没起点 1有起点
        this.isEnd = isEnd; // 0没终点 1有终点
        this.isSeE = isSeE // 0终点和起点不一样
        // 1.有起点有终点,默认终点和起点不一样
        // 2.有终点肯定有起点
        // 111 01X 情况不存在
        this.init()
    }
    init(){
        this.initGhh()
        this.initDistance()
        
        // console.log(this.Ghh)
        this.bestGhh = this.Ghh
        this.bestEvaluation = this.evaluate(this.Ghh)
        this.bestK = 0 //出现最佳迭代次数
        // console.log(this.bestEvaluation)
    }
    /**
     * 初始化Ghh路线编码
     */
    initGhh(){
        var Ghh = []
        for(var i = 0 ;i < this.cn ;i++){
            Ghh[i] = i
        }
        this.Ghh = Ghh
        // this.Ghh = random(Ghh)
        // console.log('init'+this.Ghh)

        //打乱数组
        // function random(Ghh){  
        //     var index,tmp;
        //     for(var i=Ghh.length-1; i>0; i--){  
        //         index = parseInt(Math.random()* i);  
        //         tmp=Ghh[i];  
        //         Ghh[i]=Ghh[index];  
        //         Ghh[index]=tmp;  
        //     }
        //     return Ghh
        // }   
    }
    /**
     * 克隆函数
     */
    cloneGhh(Ghh){
        return Ghh.slice(0)
    }
    /**
     * 初始化距离矩阵Distance[][](未测试)
     */
    initDistance(){
        var Distance = new Array()
        for(var i = 0;i < this.cn ;i++){
            var Distance2 = new Array()
            for(var k = 0;k < this.cn ;k++){        
                if(i == k){
                    Distance2[k] = 0;
                }
                else{
                    Distance2[k] = this.calcDistance(this.ocl[i],this.ocl[k])
                }
                
            }
            Distance[i] = Distance2
        }
        this.Distance = Distance
        // console.log(this.Distance.toString())
    }
    /**
     * 计算两个城市之间的距离
     * @param {array} cityA
     * @param {array} cityB
     * @returns 两地的距离
     */
    calcDistance(cityA,cityB){
        var x = Math.abs(cityA[0]-cityB[0]) //x轴距离
        var y = Math.abs(cityA[1]-cityB[1]) //y轴距离
        return Math.sqrt(x*x + y*y)
    }
    /**
     * 降温函数
     */
    cool(){
        this.T = this.t0 / (1 + this.k)
    }
    // cool(){
    //     this.T = this.t0 /(Math.log(1 + this.k)/Math.log(10))
    // }
    /**
     * 评估编码代表的路径所花费的时间,用户选择起点与终点
     * @param {array} Ghh 要评估的编码
     */
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

    
    //是否接受劣解
    isUpdate() {
		var temp = - ((this.evaluate(this.tempGhh) - this.evaluate(this.Ghh)) /(this.K * this.T));
        var p = Math.exp(temp);
		if (p > Math.random())
			return true;
		else
			return false;
	}

    /**
     * 通过50%移位shift，25%倒置reverse，25%置换swap产生新路线
     */
    getNewGhh(){
        var sel = this
        var num = Math.random()
        var type = "shift"

        var len = this.Ghh.length

        var k = parseInt(Math.random()*(len - this.isStart - this.isEnd))+this.isStart
        var m = parseInt(Math.random()*(len - this.isStart - this.isEnd))+this.isStart
        while(m == k){
            m = parseInt(Math.random()*(len - this.isStart - this.isEnd))+this.isStart
        }
        
                
        if(k > m){ //保证k <= m
            var c = k
            k = m
            m = c
        }
        if(num <= 0.25){
            type = "swap"
        }
        else if(num <= 0.5){
            type = "reverse"
        }
        switch(type){
            case 'swap':
                this.tempGhh = swap(k,m)
                break;
            case 'reverse':
                this.tempGhh = reverse(k,m)
                break;
            default:
                this.tempGhh = shift(k,m)
                
        }
        //概率操作 0 == this.is
        function shift(k,m){
            var tempGhh = sel.cloneGhh(sel.Ghh)
            if(m == len - sel.isEnd - 1){
                var city = tempGhh[sel.isStart]
            }
            else{
                var city = tempGhh[m+1]
            }
            for(var i = m ; i >= k; i--){
                if(i == len - sel.isEnd -1){
                    tempGhh[sel.isStart] = tempGhh[i]
                }
                else{
                    tempGhh[i+1] = tempGhh[i]
                }
                
            }
            tempGhh[k] = city
            return tempGhh
        }
        function swap(k,m){
            var tempGhh = sel.cloneGhh(sel.Ghh)
            var c =  tempGhh[k]
            tempGhh[k] = tempGhh[m]
            tempGhh[m] = c
            return tempGhh
        }
        function reverse(k,m){
            var tempGhh = sel.cloneGhh(sel.Ghh)
            var reverseGhh = tempGhh.slice(k,m+1).reverse()
            for(var i = k; i <= m;i++){
                tempGhh[i] = reverseGhh[i - k]
            }
            return tempGhh
        }
    }
    run(){
        console.log(this.T)
        while(this.T > 0.1){ //结束条件   
            // console.log("n"+this.N)  
            for(var i = 0 ;i < this.N;i++){
                this.k += 1;
                // console.log(this.k)
                this.getNewGhh() //得到this.tempGhh 赋新值
                if(this.evaluate(this.tempGhh) <= this.evaluate(this.Ghh)){
                    this.Ghh = this.cloneGhh(this.tempGhh)

                    if(this.evaluate(this.Ghh) < this.evaluate(this.bestGhh)){
                        this.bestGhh = this.cloneGhh(this.Ghh)
                        this.bestEvaluation = this.evaluate(this.bestGhh)
                        this.bestK = this.k
                    }
                }
                else{
                    if(this.isUpdate()){
                        this.Ghh = this.cloneGhh(this.tempGhh)
                    }
                } 
            }
            this.cool()
            this.Tcool = this.Tcool+1;
        }
        console.log('结束:共迭代:'+ this.k+';最佳迭代K:'+this.bestK)
        console.log('最佳编码路线:'+ this.bestGhh+';路程花费:'+this.bestEvaluation)
        console.log('共降温:'+this.Tcool)
    }
}