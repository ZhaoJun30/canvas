//设置滚动
var scrollPro=0;
var jian = 24;

function scrollInit() {
  //var _totalF = (exportRoot.main.totalFrames - 1) * jian;
  scroller = new Scroller(function (left, top, zoom) {
    console.log(scrollPro,top);
    //scrollPro = (top / jian); //减慢滑动
    // scrollPro = exportRoot.main.totalFrames-1-(top/12);//倒播
   /*  if (scrollPro != 0) {
      exportRoot.main.gotoAndStop(scrollPro);
    }
    // 制定位置播放声音
    if (scrollPro > 1 && scrollPro < 10) {
      playS('p0')
    }
    if (scrollPro > 140 && scrollPro < 150) {
      playS('p1');
      pageBgM(1);
    }
    if (scrollPro > 193 && scrollPro < 195) {
      playS('pt6');
    }
    if (scrollPro > 690 && scrollPro < 692) {
      playS('pt2')
    }
    if (scrollPro > 330 && scrollPro < 340) {
      pageBgM(2);
    }

    if (scrollPro > 460 && scrollPro < 462) {
      playS('pt7');
    }

    if (scrollPro > 520 && scrollPro < 530) {
      playS('p22')
    }
    if (scrollPro > 650 && scrollPro < 660) {
      playS('p31')
    }

    if (scrollPro > 620 && scrollPro < 630) {

      pageBgM(3);
    }

    if (scrollPro > 700 && scrollPro < 710) {
      playS('p33')
    }



    if (scrollPro > 837 && scrollPro < 847) {

      pageBgM(4);
    }

    if (scrollPro > 870 && scrollPro < 872) {

      playS('pt4')
    }

    if (scrollPro > 950 && scrollPro < 952) {
      playS('p41')
    }

    if (scrollPro > 1000 && scrollPro < 1002) {
      pageBgM(5);
    }

    if (scrollPro > 1054 && scrollPro < 1056) {
      playS('pt3')

    }
    if (scrollPro > 420 && scrollPro < 430) {
      playS('p21')
    }

    if (scrollPro > 1100 && scrollPro < 1102) {
      playS('p52');
    }

    if (scrollPro > 1170 && scrollPro < 1172) {
      pageBgM(6);
    }

    if (scrollPro > 1300 && scrollPro < 1302) {

      playS('pt5');
    }
    if (scrollPro > 1400 && scrollPro < 1402) {
      playS('p7');
      playS('p6');
    }
 */





  }, {
    zooming: true,
    bouncing: false
  })
  // scroller.setDimensions(stage.width, stage.height, stage.width, _totalF);
  // scroller.scrollTo(0,_totalF,false);	//倒播
  //添加触屏事件
  var mousedown = false;
  document.addEventListener("touchstart", function (e) {
    console.log('wew');
    
    scroller.doTouchStart(e.touches, e.timeStamp);
    mousedown = true;
  }, false);

  document.addEventListener("touchmove", function (e) {
    e.preventDefault();
    if (!mousedown) {
      return;
    }
    scroller.doTouchMove(e.touches, e.timeStamp);
    mousedown = true;
  }, false);

  document.addEventListener("touchend", function (e) {
    if (!mousedown) {
      return;
    }
    scroller.doTouchEnd(e.timeStamp);
    mousedown = false;
  }, false);
}

scrollInit();