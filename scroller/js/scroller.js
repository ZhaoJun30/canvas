
// Scroller
var Scroller;
!function () {
  var e = function () { };
  Scroller = function (o, _) {
    this.__callback = o,
      this.options = {
        scrollingX: !0,
        scrollingY: !0,
        animating: !0,
        animationDuration: 250,
        bouncing: !0,
        locking: !0,
        paging: !1,
        snapping: !1,
        zooming: !1,
        minZoom: .5,
        maxZoom: 3,
        speedMultiplier: 1,
        scrollingComplete: e,
        penetrationDeceleration: .03,
        penetrationAcceleration: .08
      };
    for (var t in _)
      this.options[t] = _[t]
  }
    ;
  var o = function (e) {
    return Math.pow(e - 1, 3) + 1
  }
    , _ = function (e) {
      return (e /= .5) < 1 ? .5 * Math.pow(e, 3) : .5 * (Math.pow(e - 2, 3) + 2)
    }
    , t = {
      __isSingleTouch: !1,
      __isTracking: !1,
      __didDecelerationComplete: !1,
      __isGesturing: !1,
      __isDragging: !1,
      __isDecelerating: !1,
      __isAnimating: !1,
      __clientLeft: 0,
      __clientTop: 0,
      __clientWidth: 0,
      __clientHeight: 0,
      __contentWidth: 0,
      __contentHeight: 0,
      __snapWidth: 100,
      __snapHeight: 100,
      __refreshHeight: null,
      __refreshActive: !1,
      __refreshActivate: null,
      __refreshDeactivate: null,
      __refreshStart: null,
      __zoomLevel: 1,
      __scrollLeft: 0,
      __scrollTop: 0,
      __maxScrollLeft: 0,
      __maxScrollTop: 0,
      __scheduledLeft: 0,
      __scheduledTop: 0,
      __scheduledZoom: 0,
      __lastTouchLeft: null,
      __lastTouchTop: null,
      __lastTouchMove: null,
      __positions: null,
      __minDecelerationScrollLeft: null,
      __minDecelerationScrollTop: null,
      __maxDecelerationScrollLeft: null,
      __maxDecelerationScrollTop: null,
      __decelerationVelocityX: null,
      __decelerationVelocityY: null,
      setDimensions: function (e, o, _, t) {
        var l = this;
        e === +e && (l.__clientWidth = e),
          o === +o && (l.__clientHeight = o),
          _ === +_ && (l.__contentWidth = _),
          t === +t && (l.__contentHeight = t),
          l.__computeScrollMax(),
          l.scrollTo(l.__scrollLeft, l.__scrollTop, !0)
      },
      setPosition: function (e, o) {
        var _ = this;
        _.__clientLeft = e || 0,
          _.__clientTop = o || 0
      },
      setSnapSize: function (e, o) {
        var _ = this;
        _.__snapWidth = e,
          _.__snapHeight = o
      },
      activatePullToRefresh: function (e, o, _, t) {
        var l = this;
        l.__refreshHeight = e,
          l.__refreshActivate = o,
          l.__refreshDeactivate = _,
          l.__refreshStart = t
      },
      triggerPullToRefresh: function () {
        this.__publish(this.__scrollLeft, -this.__refreshHeight, this.__zoomLevel, !0),
          this.__refreshStart && this.__refreshStart()
      },
      finishPullToRefresh: function () {
        var e = this;
        e.__refreshActive = !1,
          e.__refreshDeactivate && e.__refreshDeactivate(),
          e.scrollTo(e.__scrollLeft, e.__scrollTop, !0)
      },
      getValues: function () {
        var e = this;
        return {
          left: e.__scrollLeft,
          top: e.__scrollTop,
          zoom: e.__zoomLevel
        }
      },
      getScrollMax: function () {
        var e = this;
        return {
          left: e.__maxScrollLeft,
          top: e.__maxScrollTop
        }
      },
      zoomTo: function (e, o, _, t, l) {
        var i = this;
        if (!i.options.zooming)
          throw new Error("Zooming is not enabled!");
        l && (i.__zoomComplete = l),
          i.__isDecelerating && (core.effect.Animate.stop(i.__isDecelerating),
            i.__isDecelerating = !1);
        var n = i.__zoomLevel;
        null == _ && (_ = i.__clientWidth / 2),
          null == t && (t = i.__clientHeight / 2),
          e = Math.max(Math.min(e, i.options.maxZoom), i.options.minZoom),
          i.__computeScrollMax(e);
        var r = (_ + i.__scrollLeft) * e / n - _
          , a = (t + i.__scrollTop) * e / n - t;
        r > i.__maxScrollLeft ? r = i.__maxScrollLeft : r < 0 && (r = 0),
          a > i.__maxScrollTop ? a = i.__maxScrollTop : a < 0 && (a = 0),
          i.__publish(r, a, e, o)
      },
      zoomBy: function (e, o, _, t, l) {
        var i = this;
        i.zoomTo(i.__zoomLevel * e, o, _, t, l)
      },
      scrollTo: function (e, o, _, t) {
        var l = this;
        if (l.__isDecelerating && (core.effect.Animate.stop(l.__isDecelerating),
          l.__isDecelerating = !1),
          null != t && t !== l.__zoomLevel) {
          if (!l.options.zooming)
            throw new Error("Zooming is not enabled!");
          e *= t,
            o *= t,
            l.__computeScrollMax(t)
        } else
          t = l.__zoomLevel;
        l.options.scrollingX ? l.options.paging ? e = Math.round(e / l.__clientWidth) * l.__clientWidth : l.options.snapping && (e = Math.round(e / l.__snapWidth) * l.__snapWidth) : e = l.__scrollLeft,
          l.options.scrollingY ? l.options.paging ? o = Math.round(o / l.__clientHeight) * l.__clientHeight : l.options.snapping && (o = Math.round(o / l.__snapHeight) * l.__snapHeight) : o = l.__scrollTop,
          e = Math.max(Math.min(l.__maxScrollLeft, e), 0),
          o = Math.max(Math.min(l.__maxScrollTop, o), 0),
          e === l.__scrollLeft && o === l.__scrollTop && (_ = !1),
          l.__isTracking || l.__publish(e, o, t, _)
      },
      scrollBy: function (e, o, _) {
        var t = this
          , l = t.__isAnimating ? t.__scheduledLeft : t.__scrollLeft
          , i = t.__isAnimating ? t.__scheduledTop : t.__scrollTop;
        t.scrollTo(l + (e || 0), i + (o || 0), _)
      },
      doMouseZoom: function (e, o, _, t) {
        var l = this
          , i = e > 0 ? .97 : 1.03;
        return l.zoomTo(l.__zoomLevel * i, !1, _ - l.__clientLeft, t - l.__clientTop)
      },
      doTouchStart: function (e, o) {
        if (null == e.length)
          throw new Error("Invalid touch list: " + e);
        if (o instanceof Date && (o = o.valueOf()),
          "number" != typeof o)
          throw new Error("Invalid timestamp value: " + o);
        var _ = this;
        _.__interruptedAnimation = !0,
          _.__isDecelerating && (core.effect.Animate.stop(_.__isDecelerating),
            _.__isDecelerating = !1,
            _.__interruptedAnimation = !0),
          _.__isAnimating && (core.effect.Animate.stop(_.__isAnimating),
            _.__isAnimating = !1,
            _.__interruptedAnimation = !0);
        var t, l, i = 1 === e.length;
        i ? (t = e[0].pageX,
          l = e[0].pageY) : (t = Math.abs(e[0].pageX + e[1].pageX) / 2,
            l = Math.abs(e[0].pageY + e[1].pageY) / 2),
          _.__initialTouchLeft = t,
          _.__initialTouchTop = l,
          _.__zoomLevelStart = _.__zoomLevel,
          _.__lastTouchLeft = t,
          _.__lastTouchTop = l,
          _.__lastTouchMove = o,
          _.__lastScale = 1,
          _.__enableScrollX = !i && _.options.scrollingX,
          _.__enableScrollY = !i && _.options.scrollingY,
          _.__isTracking = !0,
          _.__didDecelerationComplete = !1,
          _.__isDragging = !i,
          _.__isSingleTouch = i,
          _.__positions = []
      },
      doTouchMove: function (e, o, _) {
        if (null == e.length)
          throw new Error("Invalid touch list: " + e);
        if (o instanceof Date && (o = o.valueOf()),
          "number" != typeof o)
          throw new Error("Invalid timestamp value: " + o);
        var t = this;
        if (t.__isTracking) {
          var l, i;
          2 === e.length ? (l = Math.abs(e[0].pageX + e[1].pageX) / 2,
            i = Math.abs(e[0].pageY + e[1].pageY) / 2) : (l = e[0].pageX,
              i = e[0].pageY);
          var n = t.__positions;
          if (t.__isDragging) {
            var r = l - t.__lastTouchLeft
              , a = i - t.__lastTouchTop
              , c = t.__scrollLeft
              , s = t.__scrollTop
              , p = t.__zoomLevel;
            if (null != _ && t.options.zooming) {
              var h = p;
              if (p = p / t.__lastScale * _,
                p = Math.max(Math.min(p, t.options.maxZoom), t.options.minZoom),
                h !== p) {
                var f = l - t.__clientLeft
                  , m = i - t.__clientTop;
                c = (f + c) * p / h - f,
                  s = (m + s) * p / h - m,
                  t.__computeScrollMax(p)
              }
            }
            if (t.__enableScrollX) {
              c -= r * this.options.speedMultiplier;
              var g = t.__maxScrollLeft;
              (c > g || c < 0) && (t.options.bouncing ? c += r / 2 * this.options.speedMultiplier : c = c > g ? g : 0)
            }
            if (t.__enableScrollY) {
              s -= a * this.options.speedMultiplier;
              var u = t.__maxScrollTop;
              (s > u || s < 0) && (t.options.bouncing ? (s += a / 2 * this.options.speedMultiplier,
                t.__enableScrollX || null == t.__refreshHeight || (!t.__refreshActive && s <= -t.__refreshHeight ? (t.__refreshActive = !0,
                  t.__refreshActivate && t.__refreshActivate()) : t.__refreshActive && s > -t.__refreshHeight && (t.__refreshActive = !1,
                    t.__refreshDeactivate && t.__refreshDeactivate()))) : s = s > u ? u : 0)
            }
            n.length > 60 && n.splice(0, 30),
              n.push(c, s, o),
              t.__publish(c, s, p)
          } else {
            var v = t.options.locking ? 3 : 0
              , T = 5
              , d = Math.abs(l - t.__initialTouchLeft)
              , S = Math.abs(i - t.__initialTouchTop);
            t.__enableScrollX = t.options.scrollingX && d >= v,
              t.__enableScrollY = t.options.scrollingY && S >= v,
              n.push(t.__scrollLeft, t.__scrollTop, o),
              t.__isDragging = (t.__enableScrollX || t.__enableScrollY) && (d >= T || S >= T),
              t.__isDragging && (t.__interruptedAnimation = !1)
          }
          t.__lastTouchLeft = l,
            t.__lastTouchTop = i,
            t.__lastTouchMove = o,
            t.__lastScale = _
        }
      },
      doTouchEnd: function (e) {
        if (e instanceof Date && (e = e.valueOf()),
          "number" != typeof e)
          throw new Error("Invalid timestamp value: " + e);
        var o = this;
        if (o.__isTracking) {
          if (o.__isTracking = !1,
            o.__isDragging)
            if (o.__isDragging = !1,
              o.__isSingleTouch && o.options.animating && e - o.__lastTouchMove <= 100) {
              for (var _ = o.__positions, t = _.length - 1, l = t, i = t; i > 0 && _[i] > o.__lastTouchMove - 100; i -= 3)
                l = i;
              if (l !== t) {
                var n = _[t] - _[l]
                  , r = o.__scrollLeft - _[l - 2]
                  , a = o.__scrollTop - _[l - 1];
                o.__decelerationVelocityX = r / n * (1e3 / 60),
                  o.__decelerationVelocityY = a / n * (1e3 / 60);
                var c = o.options.paging || o.options.snapping ? 4 : 1;
                Math.abs(o.__decelerationVelocityX) > c || Math.abs(o.__decelerationVelocityY) > c ? o.__refreshActive || o.__startDeceleration(e) : o.options.scrollingComplete()
              } else
                o.options.scrollingComplete()
            } else
              e - o.__lastTouchMove > 100 && o.options.scrollingComplete();
          o.__isDecelerating || (o.__refreshActive && o.__refreshStart ? (o.__publish(o.__scrollLeft, -o.__refreshHeight, o.__zoomLevel, !0),
            o.__refreshStart && o.__refreshStart()) : ((o.__interruptedAnimation || o.__isDragging) && o.options.scrollingComplete(),
              o.scrollTo(o.__scrollLeft, o.__scrollTop, !0, o.__zoomLevel),
              o.__refreshActive && (o.__refreshActive = !1,
                o.__refreshDeactivate && o.__refreshDeactivate()))),
            o.__positions.length = 0
        }
      },
      __publish: function (e, t, l, i) {
        var n = this
          , r = n.__isAnimating;
        if (r && (core.effect.Animate.stop(r),
          n.__isAnimating = !1),
          i && n.options.animating) {
          n.__scheduledLeft = e,
            n.__scheduledTop = t,
            n.__scheduledZoom = l;
          var a = n.__scrollLeft
            , c = n.__scrollTop
            , s = n.__zoomLevel
            , p = e - a
            , h = t - c
            , f = l - s
            , m = function (e, o, _) {
              _ && (n.__scrollLeft = a + p * e,
                n.__scrollTop = c + h * e,
                n.__zoomLevel = s + f * e,
                n.__callback && n.__callback(n.__scrollLeft, n.__scrollTop, n.__zoomLevel))
            }
            , g = function (e) {
              return n.__isAnimating === e
            }
            , u = function (e, o, _) {
              o === n.__isAnimating && (n.__isAnimating = !1),
                (n.__didDecelerationComplete || _) && n.options.scrollingComplete(),
                n.options.zooming && (n.__computeScrollMax(),
                  n.__zoomComplete && (n.__zoomComplete(),
                    n.__zoomComplete = null))
            };
          n.__isAnimating = core.effect.Animate.start(m, g, u, n.options.animationDuration, r ? o : _)
        } else
          n.__scheduledLeft = n.__scrollLeft = e,
            n.__scheduledTop = n.__scrollTop = t,
            n.__scheduledZoom = n.__zoomLevel = l,
            n.__callback && n.__callback(e, t, l),
            n.options.zooming && (n.__computeScrollMax(),
              n.__zoomComplete && (n.__zoomComplete(),
                n.__zoomComplete = null))
      },
      __computeScrollMax: function (e) {
        var o = this;
        null == e && (e = o.__zoomLevel),
          o.__maxScrollLeft = Math.max(o.__contentWidth * e - o.__clientWidth, 0),
          o.__maxScrollTop = Math.max(o.__contentHeight * e - o.__clientHeight, 0)
      },
      __startDeceleration: function (e) {
        var o = this;
        if (o.options.paging) {
          var _ = Math.max(Math.min(o.__scrollLeft, o.__maxScrollLeft), 0)
            , t = Math.max(Math.min(o.__scrollTop, o.__maxScrollTop), 0)
            , l = o.__clientWidth
            , i = o.__clientHeight;
          o.__minDecelerationScrollLeft = Math.floor(_ / l) * l,
            o.__minDecelerationScrollTop = Math.floor(t / i) * i,
            o.__maxDecelerationScrollLeft = Math.ceil(_ / l) * l,
            o.__maxDecelerationScrollTop = Math.ceil(t / i) * i
        } else
          o.__minDecelerationScrollLeft = 0,
            o.__minDecelerationScrollTop = 0,
            o.__maxDecelerationScrollLeft = o.__maxScrollLeft,
            o.__maxDecelerationScrollTop = o.__maxScrollTop;
        var n = function (e, _, t) {
          o.__stepThroughDeceleration(t)
        }
          , r = o.options.snapping ? 4 : .001
          , a = function () {
            var e = Math.abs(o.__decelerationVelocityX) >= r || Math.abs(o.__decelerationVelocityY) >= r;
            return e || (o.__didDecelerationComplete = !0),
              e
          }
          , c = function (e, _, t) {
            o.__isDecelerating = !1,
              o.__didDecelerationComplete && o.options.scrollingComplete(),
              o.scrollTo(o.__scrollLeft, o.__scrollTop, o.options.snapping)
          };
        o.__isDecelerating = core.effect.Animate.start(n, a, c)
      },
      __stepThroughDeceleration: function (e) {
        var o = this
          , _ = o.__scrollLeft + o.__decelerationVelocityX
          , t = o.__scrollTop + o.__decelerationVelocityY;
        if (!o.options.bouncing) {
          var l = Math.max(Math.min(o.__maxDecelerationScrollLeft, _), o.__minDecelerationScrollLeft);
          l !== _ && (_ = l,
            o.__decelerationVelocityX = 0);
          var i = Math.max(Math.min(o.__maxDecelerationScrollTop, t), o.__minDecelerationScrollTop);
          i !== t && (t = i,
            o.__decelerationVelocityY = 0)
        }
        if (e ? o.__publish(_, t, o.__zoomLevel) : (o.__scrollLeft = _,
          o.__scrollTop = t),
          !o.options.paging) {
          var n = .95;
          o.__decelerationVelocityX *= n,
            o.__decelerationVelocityY *= n
        }
        if (o.options.bouncing) {
          var r = 0
            , a = 0
            , c = o.options.penetrationDeceleration
            , s = o.options.penetrationAcceleration;
          _ < o.__minDecelerationScrollLeft ? r = o.__minDecelerationScrollLeft - _ : _ > o.__maxDecelerationScrollLeft && (r = o.__maxDecelerationScrollLeft - _),
            t < o.__minDecelerationScrollTop ? a = o.__minDecelerationScrollTop - t : t > o.__maxDecelerationScrollTop && (a = o.__maxDecelerationScrollTop - t),
            0 !== r && (r * o.__decelerationVelocityX <= 0 ? o.__decelerationVelocityX += r * c : o.__decelerationVelocityX = r * s),
            0 !== a && (a * o.__decelerationVelocityY <= 0 ? o.__decelerationVelocityY += a * c : o.__decelerationVelocityY = a * s)
        }
      }
    };
  for (var l in t)
    Scroller.prototype[l] = t[l]
}();