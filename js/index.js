// // 最原始的demo,看看需要哪些最基础的组件


//////////// const { FlatShading } = require("three");


// const { Group } = require("three");

// // const { FrontSide } = require("three");

// // const { MeshBasicMaterial } = require("three");

// var scene = new THREE.Scene();
// scene.background = new THREE.Color( 0x2E8B57 );

// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
// camera.position.z = 5;
// var renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var texture=new THREE.TextureLoader().load('./textures/1.png');
// var box_mat=new THREE.MeshBasicMaterial({
//     map:texture
// });

// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );



// var animate = function () {
//     requestAnimationFrame( animate );

//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;

//     renderer.render( scene, camera );
// };

// animate();


/////
//添加一个滚筒条控制方块之间的间距√
//声音√
//避免第一下点到雷
//胜利界面
/////

 //正方体相关变量
 var cubeSize;
 var cubeLength;
 var cubeOffset;
 var times;
 
 //系统相关变量
 //var stats;
 var renderer;//渲染器
 var camera;//相机
 var scene;//场景
 var canvas=document.createElement("canvas");//用作背景
 var sound;//声音
 var audioLoader;
 var BGMLoader;
 var BGM;
 var listener;
 var controls;
 var light;
 var drops;
 var time;
 var Timer=[];
 var gui;
 var dataControls;
 var controller;


 //游戏数据
 var level=1;//难度
 var materials;//材质
 var cubes;
 var total;
 var mineCount;
 var isGameOver;
 var mineNumber;
 var cubeButton;
 var isVisited;//防止递归的时候无限递归
 var visited;
 const hard=["easy","hard","expert"];
 var matrix;
 var ctx;
 var col;
 var isFirstClick;


 var cube1;














 //布置基本场景



 //创建场景
function InitializeBackground(){
    matrix="`1234567890-=QWERTYUIOP[]\\ASDFGHJKL;'ZXCVBNM,./";
    matrix=matrix.split("");
    ctx=canvas.getContext('2d');
    col=canvas.width/10;
    drops=[];
    for(var i=0;i<col;i++){
        drops[i]=1;
    }

    draw();

    setInterval(draw, 35);
};

function draw(){
    console.log('run');
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle="#0F0";
    ctx.font="10px arial";

    for(var i=0;i<col;i++){
        var text=matrix[Math.floor(Math.random()*matrix.length)];
        ctx.fillText(text,i*10,drops[i]*10);

        if(drops[i]*10>canvas.height && Math.random()>0.95){
            drops[i]=0;
        }
        drops[i]++;
    }
    if(window.innerWidth!=canvas.width){
        onWindowResize();
    }
}

function InitializeScene(){
    scene=new THREE.Scene();

    //创建背景
    scene.background=new THREE.Color('#84AF9B');
 //   scene.background=new THREE.CanvasTexture(document.getElementById(canvasColor));
  //  InitializeBackground();

  //  scene.background=canvas;


  //  scene.background = new THREE.CanvasTexture();
   // console.log(scene.background);
}

//相机
function InitializeCamera(){
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 200;
}

//渲染器
function InitializeRenderer(){
//    canvas=document.getElementById("canvas");
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

//声音
function InitializeSound(){
    //监听者
    var lis=new THREE.AudioListener();
    camera.add(lis);

    sound=new THREE.Audio(lis);//绑定
    sound.setVolume(0.5);
    
    
    audioLoader=new THREE.AudioLoader();
}

function InitializeBGM(){
    var listener=new THREE.AudioListener();
    camera.add(listener);

    BGM=new THREE.Audio(listener);
    BGM.setVolume(0.5);

    BGMLoader=new THREE.AudioLoader();

    BGMLoader.load('audio/bgm.mp3',function(AudioBuffer){
        BGM.setBuffer(AudioBuffer);
        BGM.setLoop(true);
        BGM.setVolume(0.5);
        //BGM.resume();
        BGM.play();
    })    
}


//鼠标可以让这个界面一直转,看起来就很dio
function InitializeOrbControls(){
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxDistance=1000;
    controls.minDistance=25;
    controls.update();
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function showAround(index){
    //递归点亮
    var arr=[];
    arr=coordinateConvert(index);
    for(var k=-1;k<2;k++){
        for(var j=-1;j<2;j++){
            for(var i=-1;i<2;i++){
                var t=[];
                t[0]=arr[0]+i;
                t[1]=arr[1]+j;
                t[2]=arr[2]+k;
                var temp=coordinateDisconvert(t);
                if((t[0]>=0 && t[0]<=cubeSize-1)
                && (t[1]>=0 && t[1]<=cubeSize-1)
                && (t[2]>=0 && t[2]<=cubeSize-1)
                && isVisited[temp]==0){
                    isVisited[temp]=1;
                    visited++;
                    cubes.children[temp].material=materials[mineNumber[temp]];
                    if(mineNumber[temp]==0){
                        showAround(temp);
                    }
                }
            }
        }
    }
}

function loseGame(){
    playSound("bomb");
    isGameOver=true;
    clearInterval(Timer['time']);
    var a=cubeSize*cubeSize;
    var timerandom=0.5;
    for(var i=0;i<cubeSize;i++){
        for(var j=0;j<cubeSize;j++){
            for(var k=0;k<cubeSize;k++){
                var t=[];
                t[0]=i;
                t[1]=j;
                t[2]=k;
                var index=coordinateDisconvert(t);
                var obj=cubes.children[index];
                TweenMax.to(
                    obj.position,
                    timerandom,
                    {
                        x:obj.position.x+(0.5-Math.random())*500,y:obj.position.y+(0.5-Math.random())*500,z:obj.position.z+Math.random()*500,delay:0,
                    }

                );
                TweenMax.to(
                    obj.position,
                    timerandom,
                    {
                        x:cubeLength*i*times-cubeOffset,y:-cubeLength*j*times+cubeOffset,z:cubeLength*k*times-cubeOffset,delay:.6,ease:Power2.easeIn
                    }
                );
            }
        }
    }
}

function winGame(){
    playSound("win");
    clearInterval(Timer['time']);
    isGameOver=true;
    console.log("you win");
}

//模仿下高端的注释写法

/*****************************************************************************
 *                                restart
 *****************************************************************************/
/**
 * 1.清除地雷
 * 2.初始化基础数据
 * 3.重新生成地雷
 * 4.重新贴皮
 *****************************************************************************/
function reStart(){
    time=0;
    if(isGameOver){
        initializeTime();
    }    
    scene.remove(cubes);
    InitializeComponent();
    InitializeInfo();
}

function reArrange(i){
    reStart();
    isFirstClick=false;
    var index=i;//obj就是要操作的对象
    var obj=cubes.children[i];
    if(index<total){
        if(!isGameOver && isVisited[index]==0 && obj.material!=materials[29]){
            isVisited[index]=1;
            visited++;
            if(mineNumber[index]==0){
                //如果选中了空白的，就点亮周围全部的
                showAround(index);
            }
            if(mineNumber[index]==30){
                if(isFirstClick){
                    reArrange(index);
                    return;
                }
                loseGame();
            }
            else{
                if(visited==total-mineCount){
                    winGame();
                }else{
                    playSound("click");
                }
            }
            obj.material=materials[mineNumber[index]];
        }
    }
   

}



//返回点击的直线上的cube
function onMouseClick(event){
//    console.log('click');
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    mouse.x=(event.clientX/window.innerWidth)*2-1;
    mouse.y=-(event.clientY/window.innerHeight)*2+1;

    raycaster.setFromCamera(mouse,camera);

    var clicked=[];
    for(let i=0;i<cubes.children.length;i++){
        clicked.push(cubes.children[i]);
    }

    var intersects=raycaster.intersectObjects(clicked);

    //得到的[0]就是离得最近的，直接用
    if(intersects.length>0){
        var obj=intersects[0].object;//obj就是要操作的对象
        var index=cubes.children.indexOf(obj);
        console.log(index);
//        console.log(mineNumber[index]);
        if(index<total){
            if(!isGameOver && isVisited[index]==0 && obj.material!=materials[29]){
                isVisited[index]=1;
                visited++;
                if(mineNumber[index]==0){
                    //如果选中了空白的，就点亮周围全部的
                    showAround(index);
                }
                if(mineNumber[index]==30){
                    if(isFirstClick){
                        reArrange(index);
                        return;
                    }
                    loseGame();
                }
                else{
                    if(visited==total-mineCount){
                        winGame();
                    }else{
                        playSound("click");
                    }
                }
                obj.material=materials[mineNumber[index]];
            }
        }
        isFirstClick=false;
    }
}

function onRightClick(event){
//    console.log("click");
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    mouse.x=(event.clientX/window.innerWidth)*2-1;
    mouse.y=-(event.clientY/window.innerHeight)*2+1;

    raycaster.setFromCamera(mouse,camera);

    var clicked=[];
    for(let i=0;i<cubes.children.length;i++){
        clicked.push(cubes.children[i]);
    }

    var intersects=raycaster.intersectObjects(clicked);

    //得到的[0]就是离得最近的，直接用
    if(intersects.length>0){
        if(!isGameOver){
            playSound("check");
        }
        var obj=intersects[0].object;//obj就是要操作的对象
        var index=cubes.children.indexOf(obj);
        if(!isGameOver && isVisited[index]==0){
            if(obj.material==materials[29]){
                obj.material=materials[37];
            }
            else if(obj.material==materials[37]){
                obj.material=materials[27];
            }
            else if( obj.material==materials[27]){
                obj.material=materials[29];
            }
        }
    
    //     //console.log(index);
    //     //console.log(mineNumber[index]);
    //     if(!isGameOver && isVisited[index]==0){
    //         isVisited[index]=1;
    //         obj.material=materials[29];//标记成flag
    //         if(mineNumber[index]==0){
    //             //如果选中了空白的，就点亮周围全部的
    //             showAround(index);
    //         }
    //     }
    // 
    }
}

function playSound (s) {
    if (sound.listener.context.state != 'running'){
 //       console.log('重启audioCtx');
        sound.listener.context.resume();
    }
    audioLoader.load( 'audio/'+s+'.mp3', function( buf ) {
        sound.setBuffer( buf );
        sound.play();
    });
}

var GuiControl=function(){
    this.distance=3;
    this.bgm=0.5;
    this.level='easy';
    this.restart=function(){
        reStart();
    }
    this.volume=0.5;
}

function initializeGUI(){
    controller=[];

   var control=new GuiControl();
   var gui=new dat.GUI({autoPlace:false});
   var guiContainer=document.getElementById('gui');
   guiContainer.appendChild(gui.domElement);

   controller[0]=gui.add(control,'distance',1.5,6);
   controller[3]=gui.add(control,'bgm',0,1);
   controller[4]=gui.add(control,'volume',0,1);
   controller[1]=gui.add(control,'level',['easy','hard','expert']);
   controller[2]=gui.add(control,'restart');

   controller[0].onChange(function(value){
        times=value;
        changeCubePos();
   })

   controller[1].onChange(function(value){
       if(value=='easy'){
           level=1;
       }
       else if(value=='hard'){
           level=2;
       }
       else if(value=='expert'){
           level=3;
       }

       reStart();
   })

   controller[3].onChange(function(value){
       BGM.setVolume(value);
   })

   controller[4].onChange(function(value){
        sound.setVolume(value);
   })
   
}






//看起来比较底层的东西在这里弄
function InitializeSystem(){
    initializeGUI();
    InitializeCamera();
    InitializeRenderer();
    InitializeScene();
    InitializeBGM();
    InitializeSound();
    InitializeOrbControls();
    window.addEventListener('click',onMouseClick,false);
    window.addEventListener('resize',onWindowResize,false);
    window.addEventListener( 'contextmenu', onRightClick,false);
}












//添加游戏元素


//添加材质包，一共0-36 37个
function InitializeMaterials(){
    materials=[];
    var material=new THREE.MeshBasicMaterial();
    //添加表示数字的材质,0-26对应0-26个雷
    for(let i=0;i<27;i++){
        var mat=material.clone();
        mat.map=new THREE.TextureLoader().load('textures/'+i+'.png');
        materials.push(mat);
    }
    //添加功能性贴图
    for(var i=0;i<5;i++){
        for(var j=0;j<3;j++){
            if(i==0 || i==4){//27是空 28是地雷 29flag 30 爆炸的雷 31 return 32 restart
                var mat2 = material.clone();
                mat2.map = new THREE.TextureLoader().load( 'textures/grids.png' );
                mat2.map.offset = new THREE.Vector2(0.33*j, 0.8-0.2*i);
                mat2.map.repeat = new THREE.Vector2(.33, .2);
                materials.push(mat2);
            }
        }
    }

    //重启按钮 33
    {
        var mat3=material.clone();
        mat3.map=new THREE.TextureLoader().load('textures/restart.png');
        materials.push(mat3);
    }

    //难度选择按钮 34 35 36
    for(var i=1;i<=3;i++){
        var mat4=material.clone();
        mat4.map=new THREE.TextureLoader().load('textures/level'+i+'.png');
        materials.push(mat4);
    }
    //37 问号按钮
    {
        var mat5=material.clone();
        mat5.map=new THREE.TextureLoader().load('textures/Q.png');
        materials.push(mat5);
    }
}

function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1:{
            return parseInt(Math.random()*minNum+1,10); 
            break; 
        }
        case 2:{
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
            break; 
        }
        default: {
            return 0; 
            break; 
        }
    }
} 

function getRandom(min,max){
    return randomNum(min,max);
}

//坐标转化,将数字转换成三维坐标
function coordinateConvert(coordinate){
    var ans=[];
    var x=coordinate%cubeSize;
    var temp1=Math.floor(coordinate/cubeSize);
    var y=temp1%cubeSize;
    var temp2=Math.floor(temp1/cubeSize);
    var z=temp2%cubeSize;

    ans[0]=x;
    ans[1]=y;
    ans[2]=z;
    return ans;
}

function coordinateDisconvert(arr){
    var ans=arr[0]+arr[1]*cubeSize+arr[2]*cubeSize*cubeSize;
    return ans;
}

function addCount(target){//增加周围的计数
    //范围是从0到124
//    console.log(target);
    var temp=coordinateConvert(target);
//    console.log(temp);

    for(var k=-1;k<2;k++){
        for(var j=-1;j<2;j++){
            for(var i=-1;i<2;i++){
                var t=[];
                t[0]=temp[0]+i;
                t[1]=temp[1]+j;
                t[2]=temp[2]+k;
                if((t[0]>=0 && t[0]<=cubeSize-1)
                && (t[1]>=0 && t[1]<=cubeSize-1)
                && (t[2]>=0 && t[2]<=cubeSize-1)){
                    var ans=coordinateDisconvert(t);
                    if(mineNumber[ans]!=30){
                        mineNumber[ans]++;
                    }
                }
            }
        }
    }
}

function InitializeGameData(size){
    isFirstClick=true;
    times=3;
    cubeSize=size;
    cubeLength=10;
    cubeOffset=cubeLength*(cubeSize-1)*times/2;

    total=Math.pow(cubeSize,3);
    mineNumber=[];
    cubeButton=[];
    isVisited=[];
    visited=0;

    for(var i=0;i<total;i++){
        isVisited[i]=0;//0表示没有访问过
    }
    mineCount=parseInt(total/(22.5-level*2.5))+1;
    isGameOver=false;

}

function InitializeGame(){

    for(var i=0;i<total;i++){
        //初始化为0个地雷
        mineNumber[i]=0;
    }
    //生成对应数量的地雷
    for(var i=0;i<mineCount;i++){
        //生成有地雷的位置
        var temp= getRandom(1,total);
        //为周围添加数字
        while(mineNumber[temp]!=0){
            //如果这个地方不是雷，在初始化阶段说明是-1，则被占用，就再找个新的地方
            temp=getRandom(1,total);
        }

        //得到了没有雷的新位置,标记成地雷
        mineNumber[temp]=30;
    }

    //增加地雷旁边格子的计数,循环全部格子
    for(var i=0;i<total;i++){
        if(mineNumber[i]==30){//
            addCount(i);
        }
    }

}

function changeCubePos(){
    for(var i=0;i<cubeSize;i++){
        for(var j=0;j<cubeSize;j++){
            for(var k=0;k<cubeSize;k++){
                var t=[];
                t[0]=i;
                t[1]=j;
                t[2]=k;
                cubes.children[coordinateDisconvert(t)].position.set(cubeLength*i*times-cubeOffset,-cubeLength*j*times+cubeOffset,cubeLength*k*times-cubeOffset);
            }
        }
    }
}

function InitializeCubes(){
    cubes=new THREE.Group();
    //基础集合体
    var geommetry=new THREE.BoxGeometry(cubeLength,cubeLength,cubeLength);
    //把方块都初始化成没点开的样子
    for(var i=0;i<cubeSize;i++){
        for(var j=0;j<cubeSize;j++){
            for(var k=0;k<cubeSize;k++){
                var mesh=new THREE.Mesh(geommetry,materials[27]);
                //以中心为基础向四周布置方块
                mesh.position.set(cubeLength*i*times-cubeOffset,-cubeLength*j*times+cubeOffset,cubeLength*k*times-cubeOffset);
                cubes.add(mesh);
            }
        }
    }

    //添加重启和难度选择按钮

    // var restartButton=new THREE.Mesh(geommetry,materials[33]);
    // restartButton.position.set(cubeLength*cubeSize*times*3/4,-cubeSize*cubeSize*times*3/4,cubeLength*cubeSize*times*3/4);
    // cubes.add(restartButton);

    // var levelButton=new THREE.Mesh(geommetry,materials[level+33]);
    // levelButton.position.set(cubeLength*cubeSize*times*3/4,cubeSize*cubeSize*times*3/4,cubeLength*cubeSize*times*3/4);
    // cubes.add(levelButton);

    scene.add(cubes);
}

//调试的时候直接打开

function check(){
    for(let i=0;i<total;i++){
        var temp=i;
        if(mineNumber[i]!=30){
 //           console.log(coordinateConvert(temp)+":"+mineNumber[i]);
            cubes.children[i].material=materials[mineNumber[i]];
        }
    }
}




//加载游戏组件
function InitializeComponent(){
    InitializeGameData(level+3);
    InitializeMaterials();
    InitializeCubes();
    InitializeGame();
//    check();
}





var animate = function () {
    requestAnimationFrame( animate );
    controls.update();
    // cube1.rotation.x += 0.01;
    // cube1.rotation.y += 0.01;
    renderer.render( scene, camera );
};

function infoUpdate(){

}

function InitializeInfo(){
    var le=document.getElementById("level");
    le.innerText="level:"+hard[level-1];
    var num=document.getElementById("mine");
    num.innerText="mine:"+mineCount;
    
}

function initializeTime(){
    time=0;
    Timer['time']=setInterval(function(){
        var a=document.getElementById("time");
        time++;
        a.innerText="time:"+time;
    },1000)
}

function GameStart(){
//    console.log("running");
    
    InitializeSystem();
    InitializeComponent();
    InitializeInfo();
    initializeTime();
  //  console.log(renderer);
 //   console.log(scene);
    animate();
}



// console.log( coordinateConvert(74));
GameStart();
 