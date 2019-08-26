const SerialPort = require('SerialPort');
const url = require('url');
const server = require("http");

let serialPort = null;
let com = [];
let baudRate = 115200;

/**
 * nodeJs服务初始化
 */
server.createServer(function (req, res) {
    let buffSend = decodeMsg(req.url);
    write2Serial(buffSend);
    res.writeHead(200, {"Content-type": "text/plain"});
    res.write("hello");
    res.end();
}).listen(8800);

function freshPort() {
    console.log('进入刷新串口函数');
    const arr = [];
    SerialPort.list((err, ports) => {
        for (let item of ports) {
            const temp = {
                value: ''
            };
            temp.value = item.comName;
            console.log(item.comName);
            arr.push(temp);
        }
        com = arr;
    });
    return com;
}

/**
 * 连接串口
 */
function serialComm() {
    console.log('串口正在打开');
    serialPort = new SerialPort(com, {
        baudRate: baudRate
    });
}

/**
 * 关闭串口
 */
function serialClose() {
    console.log('正在关闭串口');
    serialPort.close()
}

function write2Serial(data) {
    serialPort.write(data);
}

function decodeMsg(reqUrl) {
    // var buff = [0xFE,0x05,0x93,0xCF,0x7D,0x5A,0x00,0xFF];
    let buff = [0xFF, 0x00, 0xFE];
    let urlInfo = url.parse(reqUrl, true);
    let urlPath = urlInfo.pathname;
    let intValue = urlInfo.query.dt;
    switch (urlPath) {
        case '/fresh_serialPort':
            // if (intValue === 1) {
                return freshPort();
            // } else {
            //     buff[1] = 0xA3
            // }
            break;

        case '/m':
            if (intValue === 1) {
                buff[1] = 0xA4
            } else {
                buff[1] = 0xA5
            }
            break;

        case '/h':
            if (intValue === 1) {
                buff[1] = 0xA6
            } else {
                buff[1] = 0xA7
            }
            break;

        case '/msg':
            let msgLen = intValue.length;

            buff = [0xFE, 0x04 + msgLen, 0x93, 0xCF, 0x7D, 0x5A];

            for (let i = 0; i < msgLen; i++) {
                let s = intValue.substr(i, 1);
                let v = parseInt(s, 16);
                buff.push(v);
            }
            buff.push(0xFF);
            break;

        default:
            break;
    }
    return buff;
}
