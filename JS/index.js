$(function () {
    //0.添加滚动条事件
    $(".content_list").mCustomScrollbar();

    var $audio = $("audio");
    var player = new Player($audio);
    //底部音乐进度条
    var $progressBar = $(".music_progress_bar");
    var $progressLine = $(".music_progress_line");
    var $progressDot = $(".music_progress_dot");
    var progress = new Progress($progressBar,$progressLine,$progressDot);
    progress.progressClick(function(value){
        player.musicSeekTo(value);
    });
    progress.progressMove(function(value){
        player.musicSeekTo(value);
    });

    //底部音量进度条
    var $voiceBar = $(".music_voice_bar");
    var $voiceLine = $(".music_voice_line");
    var $voiceDot = $(".music_voice_dot");
    var voiceProgress = new Progress($voiceBar,$voiceLine,$voiceDot);
    voiceProgress.progressClick(function(value){
        player.musicVoice(value);
    });
    voiceProgress.progressMove(function(value){
        player.musicVoice(value);
    });
    //1.加载歌曲列表
    getPlayerList();
    function getPlayerList(){
        $.ajax({
            url:"./sources/musiclist.json",
            dataType:"json",
            success:function(data){
                player.musicList = data;
                //4.1遍历获取到的数据,创建每一条音乐
                $.each(data,function(index,ele){
                    var $item = createMusicItem(index,ele);
                    var $musicList = $(".content_list ul");
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
            },
            error:function(){
            }
        });
    }
    //2.初始化歌曲信息
    function initMusicInfo(music){
        //获取歌曲信息
        var $songImage = $(".song_info_pic img");
        var $songName = $(".song_info_name a");
        var $songSinger = $(".song_info_singer a");
        var $songAblum = $(".song_info_ablum a");
        var $songProgressName = $(".music_progress_name");
        var $songProgressTime = $(".music_progress_time");
        var $songBg = $(".mask_bg");
        //给歌曲信息赋值
        $songImage.attr("src",music.cover);
        $songName.text(music.name);
        $songSinger.text(music.singer);
        $songAblum.text(music.ablum);
        $songProgressName.text(music.name +" / "+ music.singer);
        $songProgressTime.text("00:00 / "+music.time);
        $songBg.css("background","url('"+music.cover+"')");
    }
    //3.初始化事件监听
    initEvents();
    function initEvents(){
        //2.1.监听歌曲的移入移出事件
        $(".content_list").delegate(".list_music","mouseenter",function(){
            //显示子菜单
            $(this).find(".list_menu").fadeIn(100);
            $(this).find(".list_time a").fadeIn(100);
            //隐藏时长
            $(this).find(".list_time span").fadeOut(100)
        });
        $(".content_list").delegate(".list_music","mouseleave",function(){
            //隐藏子菜单
            $(this).find(".list_menu").fadeOut(100);
            $(this).find(".list_time a").fadeOut(100);
            //显示时长
            $(this).find(".list_time span").fadeIn(100);
        });

        //静态创建时鼠标的移入移出事件
        // $(".list_music").hover(function(){
        //     //显示子菜单
        //     $(this).find(".list_menu").fadeIn(100);
        //     $(this).find(".list_time a").fadeIn(100);
        //     //隐藏时长
        //     $(this).find(".list_time span").fadeOut(100)
        // },function(){
        //     //隐藏子菜单
        //     $(this).find(".list_menu").fadeOut(100);
        //     $(this).find(".list_time a").fadeOut(100);
        //     //显示时长
        //     $(this).find(".list_time span").fadeIn(100);
        // });

        //2.2.监听复选框的点击事件
        $(".content_list").delegate(".list_check","click",function(){
            $(this).toggleClass("list_checked");
        });

        //静态选择复选框选择事件
        // $(".list_check").click(function(){
        //     $(this).toggleClass("list_checked");
        // });

        //2.3.监听播放列表的播放按钮
        $(".content_list").delegate(".list_menu_play","click",function(){
            //2.3.1切换播放按钮
            var $item = $(this).parents(".list_music");
            $(this).toggleClass("list_menu_play2");
            //2.3.2复原其他播放按钮
            $(this).parents(".list_music").siblings().find(".list_menu_play").removeClass("list_menu_play2");
            //2.3.3同步播放按钮
            if($(this).attr("class").indexOf("list_menu_play2") != -1){
                //如果不是播放按钮
                $(".music_play").addClass("music_play2");
                //让文字高亮
                $(this).parents(".list_music").find("div").css("color","#fff");
                $(this).parents(".list_music").siblings().find("div").css("color","rgba(255,255,255,0.5)");
            }else{
                //如果是暂停按钮
                $(".music_play").removeClass("music_play2");
                //让文字不高亮
                $(this).parents(".list_music").find("div").css("color","rgba(255,255,255,0.5)");
            }
            //2.3.4切换序号的状态
            $(this).parents(".list_music").find(".list_number").toggleClass("list_number2");
            $(this).parents(".list_music").siblings().find(".list_number").removeClass("list_number2");
            //2.3.5播放音乐
            player.playMusic($item.get(0).index,$item.get(0).music);
            //2.3.6切换歌曲信息
            initMusicInfo($item.get(0).music);

        });

        //3.监听底部控制区域播放按钮点击
        $(".music_play").click(function(){
            //判断有没有播放过音乐
            if(player.currentIndex == -1){
                //没有播放过音乐
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            }else{
                //已经播放过音乐
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        });
        //4.监听底部控制区域上一首按钮点击
        $(".music_pre").click(function(){
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        });
        //5.监听底部控制区域下一首按钮点击
        $(".music_next").click(function(){
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
        });
        //6.监听删除按钮
        $(".content_list").delegate(".music_delete","click",function(){
            //找到当前正在删除的音乐
            var $item = $(this).parents(".list_music");
            $item.remove();
            player.ChangeMusic($item.get(0).index);

            //判断当前删除的音乐是不是正在播放的音乐
            if($item.get(0).index == player.currentIndex){
                $(".music_next").trigger("click");
            }
            //重新调整序号
            $(".list_music").each(function(index,ele){
                ele.index = index;
                $(ele).find(".list_number").text(index + 1);
            });
        });

        //7.监听播放进度
        player.musicTimeUpdate(function(currentTime,duration,time){
            //同步时间
            $(".music_progress_time").text(time);
            //同步进度条
            //计算播放比例
            var value = currentTime / duration * 100;
            progress.setProgress(value);
        });

        //8.监听声音按钮的点击
        $(".music_voice_ico").click(function(){
            //声音图标的切换
           $(this).toggleClass("music_voice_ico2");
           //声音音量的切换
            if($(this).attr("class").indexOf("music_voice_ico2") != -1){
                //变为没有声音
                player.musicVoice(0);
            }else{
                //变为有声音
                player.musicVoice(1);
            }
        });

        //6.2切换收藏模式
        $(".footer_in").find(".music_fav").click(function(){
            $(this).toggleClass("music_fav2");
        });
        //6.3切换纯净模式
        $(".footer_in").find(".music_only").click(function(){
            $(this).toggleClass("music_only2");
        });

    }

    //定义一个方法，创建一条音乐
    function createMusicItem(index,music){
        var $items = $("<li class=\"list_music\">\n" +
            "<div class=\"list_check\"><i></i></div>\n" +
            "<div class=\"list_number\">"+(index+1)+"</div>\n" +
            "<div class=\"list_name\">"+music.name+"\n" +
            "<div class=\"list_menu\">\n" +
            "<a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
            "<a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "<a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "<a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "</div>\n" +
            "</div>\n" +
            "<div class=\"list_singer\">"+music.singer+"</div>\n" +
            "<div class=\"list_time\">\n" +
            "<span>"+music.time+"</span>\n" +
            "<a href=\"javascript:;\" title=\"删除\" class='music_delete'></a>\n" +
            "</div>\n" +
            "</li>");
        $items.get(0).index = index;
        $items.get(0).music = music;
        return $items;

    }

});