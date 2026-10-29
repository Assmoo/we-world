# We World

一个使用 Vue 3 + TypeScript + Pinia + Vue Router 构建的双人空间 Demo。

## 当前功能

- 桌面端 `4 : 14 : 6` 三列布局，移动端自动切换为单列布局
- 相册展示：百叶窗切换、自动轮播、缩略图、大图浏览
- 在一起天数：从 2026 年 8 月 11 日开始，当天计为第 1 天
- 每日留言：停止输入后自动保存，并保留历史版本
- “他爱的 / 她爱的”：可添加、编辑、删除的漂浮轮播词条
- 设置页：自动轮播、漂浮动效与本地存储状态

## 本地运行

```bash
npm install
npm run dev
```

默认访问 `http://localhost:5173`。

生产构建：

```bash
npm run build
npm run preview
```

## 数据说明

当前版本使用浏览器 `localStorage`，键名为 `we-world:v1`。留言、历史版本和喜欢词条只保存在当前浏览器，不会跨设备同步。

后续接入跨设备版本时，建议保留现有 Pinia 状态接口，将持久化层替换为 Supabase、Firebase 或自建 API。
