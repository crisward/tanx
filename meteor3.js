if (Meteor.isClient) {
  window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
          window.setTimeout(callback, 1000 / 60);
        };
  })();


  $(document).ready(function(){
    var tankAngle=0,yinc=0,xinc=0,speed=0,tankpos=$('#tank1').offset(),shells=[],shellCount=1;

    $(document).on('keydown',function(e){
      var keyCode=e.keyCode;
      if(keyCode==37){//left key
        tankAngle-=5;
      }
      if(keyCode==39){//right key
        tankAngle+=5;
      }
      if(keyCode==38){
        console.log('forward');
        speed=1;
      }
      if(keyCode==32){
        console.log('shoot');
        tankpos=$('#tank1').offset();
        var shell={
          top:tankpos.top+15,
          left:tankpos.left+15,
          yinc:yinc,
          xinc:xinc,
          life:100,
          shellId:'#shell'+shellCount
        };
        $('body').append('<div class="shell" id="shell'+shellCount+'"><div>');
        $(shell.shellId).offset(tankpos);
        shellCount++;
        shells.push(shell);
        console.log(shells);
      }
      if(keyCode==40){
        console.log('reverse');
        speed=-1;
      }
    });

    $(document).on('keyup',function(e){
      var keyCode=e.keyCode;
      if(keyCode==38 || keyCode==40){
        console.log('stop');
        speed=0;
      }
    });

    function updateShells(){
      if(shells.length<1){return;}//if no shells do nothing
      var i;
      for(i=0;i<shells.length;i++){
        shells[i].life+=-1;
        shells[i].top+=shells[i].yinc*3;
        shells[i].left+=shells[i].xinc*3;
        $(shells[i].shellId).offset({left:shells[i].left,top:shells[i].top});
      }
      var shells2=[];
      for(i=0;i<shells.length;i++){
        if(shells[i].life>0){
          shells2.push(shells[i]);
        }else{
          $(shells[i].shellId).remove();
        }
      }
      shells=shells2;//overwrite original array with new one minus dead shells
    }

    function updateTankAngle(){
      var radians = (Math.PI / 180) * ( tankAngle + 90 );
      xinc = Math.cos(radians);
      yinc = Math.sin(radians);
      $("#tank1").css({
          'transform': 'rotate('+tankAngle+'deg)',
          '-moz-transform': 'rotate('+tankAngle+'deg)',
          '-o-transform': 'rotate('+tankAngle+'deg)',
          '-webkit-transform': 'rotate('+tankAngle+'deg)'
      });
    }
    updateTankAngle();

    //render loop with tail recursion
    function render(){
      requestAnimFrame(render);
      tankpos=$('#tank1').offset();
      tankpos.top+=speed*yinc;
      tankpos.left+=speed*xinc;
      $('#tank1').offset(tankpos);
      updateTankAngle();
      updateShells();
    }
    render();

  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
