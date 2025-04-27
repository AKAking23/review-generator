import { ReviewGenerator, Product } from "./index";

// 请替换为你的DeepSeek API密钥
const API_KEY = "your-deepseek-api-key";
// npx ts-node src/example.ts
// 创建评价生成器实例
const reviewGenerator = new ReviewGenerator({
  apiKey: API_KEY,
  sentiment: "positive",
  length: "medium",
  language: "中文",
  temperature: 0.7,
});

// 定义一些产品
const products: Product[] = [
  {
    name: "无线蓝牙耳机",
    category: "电子产品",
    features: ["主动降噪", "40小时续航", "IPX7防水"],
  },
  {
    name: "保温杯",
    category: "日用品",
    features: ["不锈钢材质", "24小时保温", "大容量500ml"],
  },
];

// 生成单个产品评价
async function generateSingleReview() {
  try {
    const review = await reviewGenerator.generateReview(products[0]);
    console.log("单个产品评价：");
    console.log(review);
    console.log("\n");
  } catch (error) {
    console.error("生成单个评价失败:", error);
  }
}

// 批量生成多个产品评价
async function generateMultipleReviews() {
  try {
    const reviews = await reviewGenerator.generateBatchReviews(products);
    console.log("批量生成评价：");
    reviews.forEach((review, index) => {
      console.log(`产品 ${index + 1}: ${products[index].name}`);
      console.log(review);
      console.log("\n");
    });
  } catch (error) {
    console.error("批量生成评价失败:", error);
  }
}

// 运行示例
async function runExample() {
  console.log("开始生成收货评价示例...\n");

  await generateSingleReview();
  await generateMultipleReviews();

  console.log("示例完成");
}

runExample();
