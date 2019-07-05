(function(window){
    function Progress($progressBar,$progressLine,$progressDot){
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor:Progress,
        init:function($progressBar,$progressLine,$progressDot){
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        isMove:false,
        progressClick:function(callBack){
            var $this = this;
            //监听进度条背景的点击
            this.$progressBar.click(function(event){
                //获取与默认窗口的距离
                var normal = $(this).offset().left;
                var eventLeft = event.pageX;
                $this.$progressLine.css("width",eventLeft - normal);
                $this.$progressDot.css("left",eventLeft - normal);
                //计算进度条比例
                var value = (eventLeft - normal) / $(this).width();
                callBack(value);
            });
        },
        progressMove:function(callBack){
            var $this = this;
            //1.监听鼠标的按下事件
            var eventLeft;
            var normal = this.$progressBar.offset().left;
            var $barWidth = this.$progressBar.width();
            this.$progressBar.mousedown(function(){
                $this.isMove = true;
                //2.监听鼠标的移动事件
                //获取元素到默认窗口位置的距离
                $(document).mousemove(function(event){
                    var offset = eventLeft - normal;
                    eventLeft = event.pageX;
                    if(offset >= 0 && offset <= $barWidth){
                        //设置前景的宽度和圆点的偏移位置
                        $this.$progressLine.css("width",eventLeft - normal);
                        $this.$progressDot.css("left",eventLeft - normal);
                    }
                });
            });
            //3.监听鼠标的抬起事件
            $(document).mouseup(function(){
                $(document).off("mousemove");
                $this.isMove = false;
                //计算进度条比例
                var value = (eventLeft - normal) / $this.$progressBar.width();
                callBack(value);
            });
        },
        setProgress:function(value){
            if(this.isMove) return;
            if(value > 100 || value < 0)return;
            this.$progressLine.css({
                width : value + "%"
            });
            this.$progressDot.css({
                left : value + "%"
        });
        }
    }

    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;

})(window);