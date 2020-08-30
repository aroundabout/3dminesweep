# 3D MineSweep

同济大学 软件学院 2020 春季 web系统与技术 期末课设 3d扫雷

1850231 姚凯楠

github：<https://github.com/aroundabout/3dminesweep>

项目访问：<http://172.81.210.83/3dminesweep/html/>

1. 项目技术
   1. JavaScript
   2. three.js
2. 运行方式
   1. 项目部署在远程服务器，可以通过上文的地址直接访问
   2. 下载项目直接在本地运行index.html
3. 项目使用说明
   1. 本项目采用three.js构造3d扫雷，其中每个位置周围的26个位置可能存在雷，点开所有非雷的格子即胜利
   2. 界面说明：
      1. 左上角为游戏的基本数据，包括难度，雷数，剩余时间
      2. 右上角可以选择难度、重启、方块之间的间距，调节音量
      3. 中间为游戏主体部分
   3. 操作说明：
      1. 左键点击点开雷
      2. 左键拖动旋转视角
      3. 鼠标滚轮缩放方块远近
      4. 鼠标右键点击标雷，再次点击为？，再次点击恢复原样
