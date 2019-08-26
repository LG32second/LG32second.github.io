//https://lg32second.github.io/armDemo.js

(function(ext) {

    let currentBaud = 115200;
    let currentStatus = 1;
    let connectStatus = false;
    let tempCom = "请选择端口";


    // 当插件退出时要做的事情
    ext._shutdown = function() {};

    // 状态描述，用于提示插件的错误信息，比如不支持浏览器及版本等
    ext._getStatus = function() {
        let tmpResult = {status: 1, msg: '等待连接'};

        if(currentStatus === 2)
        {
            tmpResult.status = 2;
            tmpResult.msg = '连接成功';
        }

        return tmpResult;
    };

    /**
     * 刷新串口列表
     */
    ext.fresh_serialPort = function(){
        $.ajax({
            url: 'http://localhost:8800/fresh_serialPort',
            data: {},
            success: function (msg) {
                console.log("fresh_serialPort" + msg)
            }
        });
    };

    ext.move_forward = function(){
        $.ajax({
            url:'http://localhost:8800/m',
            data:{
                dt:1
            }
        });
    };

    ext.move_backword = function(){
        $.ajax({
            url:'http://localhost:8800/m',
            data:{
                dt:2
            }
        });
    };

    ext.hand_catch = function(){
        $.ajax({
            url:'http://localhost:8800/h',
            data:{
                dt:1
            }
        });
    };

    ext.hand_free = function(){
        $.ajax({
            url:'http://localhost:8800/h',
            data:{
                dt:2
            }
        });
    };

    /**
     * 发送新数据
     * @param msg
     */
    ext.send_message = function(msg){
        $.ajax({
            url:'http://localhost:8800/msg',
            data:{
                dt:msg
            },
            success: function (msg) {
                console.log("send_message success" + msg)
            },
            error: function (msg) {
                console.log("send_message error: " + msg)
            }
        });
    };

    /**
     * 查看连接状态
     * @return connectStatus为Boolean，连接成功为true，失败为false
     */
    ext.check_connection = function(){
        return connectStatus;
    };

    /**
     * 接受新数据
     * @param callback
     */
    ext.get_last_message = function(callback){
        $.ajax({
            url:'http://localhost:8800/m',
            type: "get",
            async:false,
            contentType:"text/plain",
            data:{
                dt:24
            },
            success:function(msg){
                currentStatus = 2;
                // info = msg;
                // callback(info);
            }
        });
    };

    /**
     * 设置波特率
     * @param baudRate
     * @returns {*}
     */
    ext.set_baud_rate = function(baudRate){
        return baudRate;
    };

    // 模块描述
    let descriptor = {
        blocks: [
            // 模块类型, 模块名称, 对应方法名称，参数依次对应的默认值
            [' ', '刷新串口', 'fresh_serialPort'],
            [' ', '向 前 ', 'move_forward'],
            [' ', '向 后 ', 'move_backword'],
            [' ', '左 转 ', 'hand_catch'],
            [' ', '右 转 ', 'hand_free'],
            [' ', '发送数据 %s ', 'send_message','1'],
            ['b', '连接成功', 'check_connection'],
            ['r', '最新接受数据', 'get_last_message'],
            ['r', "波特率: %m.baudRates", 'set_baud_rate', currentBaud],
            ['r', "端口：%m.coms", 'set_com', tempCom]
        ],
        menus:{
            my_first_menu:['one','two','three'],
            baudRates: [2400, 9600, 19200, 38400, 57600, 115200],
            coms: []
        },
        url:'https://github.com/LG32second/LG32second.github.io',
        displayName: 'scratch串口通讯测试'
    };

    // 注册扩展插件
    ScratchExtensions.register('scratch串口通讯测试v0.1', descriptor, ext);
})({});
