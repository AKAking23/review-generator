# DeepSeek收货评价生成器

一个基于DeepSeek API的自动生成产品收货评价的npm插件，使用TypeScript开发。

## 功能特点

- 🤖 利用DeepSeek大语言模型生成自然真实的收货评价
- 🌈 支持调整评价情感（正面、中性、负面）
- 📏 可自定义评价长度（简短、中等、详细）
- 🌍 支持多语言评价生成
- 📦 支持批量生成多个产品的评价

## 安装

```bash
npm install review-generator
```

## 使用方法

### 基本用法

```typescript
import { ReviewGenerator, Product } from 'review-generator';

// 初始化评价生成器
const reviewGenerator = new ReviewGenerator({
  apiKey: 'your-deepseek-api-key', // 替换为你的DeepSeek API密钥
  // 可选配置
  sentiment: 'positive',  // 'positive', 'neutral', 'negative'
  length: 'medium',       // 'short', 'medium', 'long'
  language: '中文',       // 默认为中文，也可以设置其他语言
  temperature: 0.7        // 控制生成文本的随机性 (0.0-1.0)
});

// 定义产品信息
const product: Product = {
  name: '无线蓝牙耳机',
  category: '电子产品',
  features: ['主动降噪', '40小时续航', 'IPX7防水']
};

// 生成评价
reviewGenerator.generateReview(product)
  .then(review => {
    console.log(review);
  })
  .catch(error => {
    console.error('生成评价失败:', error);
  });
```

### 批量生成评价

```typescript
const products: Product[] = [
  {
    name: '无线蓝牙耳机',
    category: '电子产品',
    features: ['主动降噪', '40小时续航', 'IPX7防水']
  },
  {
    name: '保温杯',
    category: '日用品',
    features: ['不锈钢材质', '24小时保温', '大容量500ml']
  }
];

// 批量生成评价
reviewGenerator.generateBatchReviews(products)
  .then(reviews => {
    reviews.forEach((review, index) => {
      console.log(`产品 ${index + 1}: ${products[index].name}`);
      console.log(review);
    });
  })
  .catch(error => {
    console.error('批量生成评价失败:', error);
  });
```

## API参考

### ReviewGenerator

评价生成器的主类。

```typescript
constructor(options: ReviewGeneratorOptions)
```

#### options参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| apiKey | string | 是 | - | DeepSeek API密钥 |
| model | string | 否 | 'deepseek-chat' | 使用的DeepSeek模型 |
| baseURL | string | 否 | 'https://api.deepseek.com' | DeepSeek API基础URL |
| sentiment | 'positive' \| 'neutral' \| 'negative' | 否 | 'positive' | 生成评价的情感 |
| length | 'short' \| 'medium' \| 'long' | 否 | 'medium' | 生成评价的长度 |
| language | string | 否 | '中文' | 生成评价的语言 |
| temperature | number | 否 | 0.7 | 控制生成文本随机性的参数 (0.0-1.0) |

### 方法

#### generateReview(product: Product): Promise<string>

生成单个产品的评价。

#### generateBatchReviews(products: Product[]): Promise<string[]>

批量生成多个产品的评价。

### Product接口

```typescript
interface Product {
  name: string;       // 产品名称
  category?: string;  // 产品分类 (可选)
  features?: string[]; // 产品特点 (可选)
}
```

## 许可证

MIT 