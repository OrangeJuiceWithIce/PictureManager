# 使用官方Go镜像作为构建环境
FROM golang:1.24.1 AS builder

# 设置工作目录
WORKDIR /app

# 复制go.mod和go.sum并下载依赖
COPY go.mod go.sum ./
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# 使用轻量级alpine镜像作为运行环境
FROM alpine:latest

# 安装ca证书（用于HTTPS）
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# 从构建阶段复制编译好的二进制文件
COPY --from=builder /app/main .

# 创建uploads和thumbnail目录
RUN mkdir -p uploads thumbnail

# 暴露端口
EXPOSE 8080

# 运行应用
CMD ["./main"]
