# BeeShot Server

Go 后端服务（预留）

## 规划功能

- 用户认证
- 作品存储
- 模板市场
- 资源管理

## 目录结构（规划）

```
server/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── api/
│   ├── service/
│   ├── repository/
│   └── model/
├── pkg/
├── go.mod
└── go.sum
```

## 开发

```bash
# 初始化模块（后续执行）
go mod init github.com/beeshot/server

# 运行
go run cmd/server/main.go
```
