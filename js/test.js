var Options = function() {
    this.message = 'dat.gui';
    this.speed = 0.8;
    this.displayOutline = false;
    this.button = function() {};
  };
  
  window.onload = function() {
    var options = new Options();
    var gui = new dat.GUI();
  
    gui.add(options, 'message');
    gui.add(options, 'speed', -5, 5);
    gui.add(options, 'displayOutline');
    gui.add(options, 'button');
  };