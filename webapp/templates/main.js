(function ($) {
    var Core = core.Core,
        __super__ = Core.prototype;

    function Main(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    Main.inherits(Core);
    var proto = Main.prototype;

    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    proto.construct = function(opts){
        __super__.construct.call(this, opts);
        this.init();
    };
    proto.init = function(){
        console.log("Start writing your stuff here");
    };

    core.registerNamespace("window.Main");
    window.Main = Main;

})(core.selector);