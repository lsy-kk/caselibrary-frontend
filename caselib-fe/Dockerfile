# 基础镜像使用Nginx
FROM nginx
# 作者
MAINTAINER lsykk
# 添加时区环境变量，亚洲，上海
ENV TimeZone=Asia/Shanghai
# 将前端dist文件中的内容复制到nginx目录
COPY dist/  /usr/share/nginx/html/
# 用本地的nginx配置文件覆盖镜像的Nginx配置
# 删除nginx 默认配置
RUN rm /etc/nginx/conf.d/default.conf
# 添加我们自己的配置 default.conf 在下面
ADD default.conf /etc/nginx/conf.d/
# 挂载nginx.conf到nginx
# COPY nginx.conf /etc/nginx/nginx.conf
# 挂载证书文件至nginx的'ssl'文件夹
# COPY ssl/ /etc/nginx/ssl/
# 暴露端口
EXPOSE 80