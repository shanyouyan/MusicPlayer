(function(window){
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor:Player,
        musicList:[],
        init:function($audio){
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex : -1,
        playMusic:function(index,music){
            //判断是否是同一首音乐
            if(this.currentIndex == index){
                //播放的是同一首音乐
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
                //播放的不是同一首音乐
                this.$audio.attr("src",music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex:function(){
            var index = this.currentIndex -1;
            //判断是否是最后一首
            if(index < 0){
               index = this.musicList.length -1;
            }
            return index;
        },
        nextIndex:function(){
            var index = this.currentIndex + 1;
            if(index>this.musicList.length - 1){
                index = 0;
            }
            return index;
        },
        ChangeMusic:function(index){
            //删除对应的数据
            this.musicList.splice(index,1);

            //判断当前删除的音乐是否是正在删除的音乐
            if(index < this.currentIndex){
                this.currentIndex = this.currentIndex - 1;
            }
        },
        musicTimeUpdate:function(callBack){
            var $this = this;
            this.$audio.on("timeupdate",function(){
                var duration = $this.audio.duration;
                var currentTime = $this.audio.currentTime;
                var time = $this.formatDate(currentTime,duration);
                callBack(currentTime,duration,time);
            });
        },
        formatDate:function(currentTime,duration){
            var startMin = parseInt(currentTime / 60);
            var startSec = parseInt(currentTime % 60);
            if(startMin < 10){
                startMin = "0" +startMin;
            }
            if(startSec < 10){
                startSec = "0" +startSec;
            }
            var endMin = parseInt(duration / 60);
            var endSec = parseInt(duration % 60);
            if(endMin < 10){
                endMin = "0"+ endMin;
            }
            if(endSec < 10){
                endSec = "0"+ endSec;
            }
            return startMin +":"+ startSec +" / "+endMin+":"+endSec;
        },
        musicSeekTo:function(value){
          this.audio.currentTime = this.audio.duration * value;
        },
        musicVoice:function(value){
            this.audio.volume = value;
        }

    }

    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;

})(window);