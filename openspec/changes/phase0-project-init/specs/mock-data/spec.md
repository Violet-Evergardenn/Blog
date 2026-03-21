## ADDED Requirements

### Requirement: TypeScript 类型定义
系统 SHALL 为以下数据实体定义 TypeScript 接口：Essay（文章）、Project（项目）、Picture（图片）、BlogLink（友链）、SiteConfig（站点配置）。

#### Scenario: 类型定义可导入
- **WHEN** 在任意组件中 `import type { Essay } from '@/types'`
- **THEN** TypeScript 编译无错误，类型提示正常

### Requirement: Essay 类型
Essay 类型 SHALL 包含字段：id (string)、title (string)、date (string)、content (string)、tags (string[])、summary (string)、coverImage (string, 可选)、isRead (boolean)。

#### Scenario: Essay 类型完整
- **WHEN** 创建 Essay 类型的对象
- **THEN** 必须包含 id、title、date、content、tags、summary、isRead 字段

### Requirement: Project 类型
Project 类型 SHALL 包含字段：id (string)、name (string)、year (number)、description (string)、tags (string[])、icon (string)、websiteUrl (string)。

#### Scenario: Project 类型完整
- **WHEN** 创建 Project 类型的对象
- **THEN** 必须包含所有规定字段

### Requirement: Mock 示例数据
系统 SHALL 提供 Mock 数据文件，包含至少 3 篇示例文章、4 个示例项目、5 张示例图片。

#### Scenario: Mock 数据可导入
- **WHEN** 在组件中 `import { mockEssays } from '@/data/mock'`
- **THEN** 获得符合类型定义的示例数据数组