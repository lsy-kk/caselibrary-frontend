// 封装好的mqtt收发消息组件
import { INotice } from '@/type/notice';
import mqtt from 'mqtt';
import type { MqttClient, OnMessageCallback } from 'mqtt';
import { ref, onUnmounted } from 'vue';
class MQTT {
    url: string; // mqtt地址
    topic: string; // 一个订阅地址
    client?: MqttClient;
    constructor(topic: string) {
        this.topic = topic;
        // 虽然是mqtt但是在客户端这里必须采用websock的链接方式
        this.url = import.meta.env.VITE_BASE_MQTT_URL;
    }
    // 初始化mqtt
    init() {
        const options = {
            clean: true,// 保留会话
            // 认证信息
            clientId: "chat-"+ Math.random().toString(16).substr(2, 8),
            username: "admin", //用户名 不用的话什么也不用填
            password: "001128lsy", //密码 不用的话什么也不用填
            connectTimeout: 4000, // 超时时间
            reconnectPeriod: 4000, // 重连时间间隔
        };
        this.client = mqtt.connect(this.url, options);
        this.client.on('error', (error: any) => {
            // console.log(error);
        });
        this.client.on('reconnect', (error: Error) => {
            // console.log(error);
        });
    }
    // 取消订阅
    unsubscribes() {
        if (this.client !== undefined){
            this.client.unsubscribe(this.topic, (error: Error) => {
                if (!error) {
                    // console.log(this.topic, '取消订阅成功');
                } 
                else {
                    // console.log(this.topic, '取消订阅失败');
                }
            });
        }
    }
    // 连接
    link() {
        if (this.client !== undefined){
            this.client.on('connect', () => {
                if (this.client !== undefined){
                    this.client.subscribe(this.topic, (error: any) => {
                        if (!error) {
                            // console.log('订阅成功');
                        } else {
                            // console.log('订阅失败');
                        }
                    });
                }
            });
        }
        
    }
    // 发布消息
    publish(topic: string, notice: INotice){
        if (this.client !== undefined){
            this.client.publish(topic, JSON.stringify(notice));
        }
    }
    //收到的消息
    get(callback: OnMessageCallback) {
        if (this.client !== undefined){
            this.client.on('message', callback);
        }
    }
    //结束链接
    over() {
        if (this.client !== undefined){
            this.client.end();
        }
    }
}
export default function useMqtt(topic: string) {
    const PublicMqtt = ref<MQTT | null>(null);
    // 设置订阅地址
    PublicMqtt.value = new MQTT(topic);
    // 初始化mqtt
    PublicMqtt.value.init();
    // 链接mqtt
    PublicMqtt.value.link();
    const mqttReceive = (callback: OnMessageCallback) => {
        PublicMqtt.value?.get(callback);
    };
    const mqttSend = (notice: INotice) => {
        PublicMqtt.value?.publish(topic, notice);
    };
    // 页面销毁结束订阅
    onUnmounted(() => {
        if (PublicMqtt.value) {
            PublicMqtt.value.unsubscribes();
            PublicMqtt.value.over();
        }
    });
    return {
        mqttReceive, mqttSend
    };
}
// 使用
// import useMqtt from '@/composables/utils/useMqtt';
// const { mqttReceive, mqttSend } = useMqtt();
// mqttReceive('订阅的topic', (topic, message) => {
//    const msg = JSON.parse(message.toString());
//    // console.log(msg);
// });
// mqttSend('订阅的topic', notice);
 