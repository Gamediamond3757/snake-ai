class Chart {

  constructor(x, y, width, height, data) {
    
    //Game Position & Size
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.data = data;
    
    this.resolution = 200;

    
    //Style
    this.backgroundColor = '#000000';
    this.chartColor = '#0055AA';

  }
  
  
  //Update Function
  
  update(){
    noStroke();
    fill(this.backgroundColor);
    rect(this.x, this.y, this.width, this.height);
    
    fill(this.chartColor);
    
    if(this.data.length>this.resolution){
      this.data.shift();
    }
    
    let maxValue = Math.max(...this.data);
    let minValue = Math.min(...this.data);
    
    let dif = Math.abs(maxValue-minValue)
    let step = this.height/(dif);
    

    for (let i = 0; i < this.data.length; i++) {
      rect(this.x + i*((this.width/this.resolution)), this.y, (this.width/this.resolution), -(step*(this.data[i]-minValue)));
    }
  }

}
  
  