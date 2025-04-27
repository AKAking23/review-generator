import { OpenAI } from "openai";

/**
 * 产品类型
 */
export interface Product {
  /**
   * 产品名称
   */
  name: string;
  /**
   * 产品分类 (例如: 电子产品, 服装, 食品等)
   */
  category?: string;
  /**
   * 产品特点
   */
  features?: string[];
}

/**
 * 评价生成选项
 */
export interface ReviewGeneratorOptions {
  /**
   * DeepSeek API密钥
   */
  apiKey: string;
  /**
   * 模型名称, 默认为 "deepseek-chat"
   */
  model?: string;
  /**
   * 基础URL, 默认为 "https://api.deepseek.com"
   */
  baseURL?: string;
  /**
   * 生成的评价情感 (正面、中性或负面)
   */
  sentiment?: "positive" | "neutral" | "negative";
  /**
   * 评价长度
   */
  length?: "short" | "medium" | "long";
  /**
   * 评价语言
   */
  language?: string;
  /**
   * 随机性参数 (0.0 到 1.0)
   */
  temperature?: number;
}

/**
 * 默认选项
 */
const DEFAULT_OPTIONS: Partial<ReviewGeneratorOptions> = {
  model: "deepseek-chat",
  baseURL: "https://api.deepseek.com",
  sentiment: "positive",
  length: "medium",
  language: "中文",
  temperature: 0.7,
};

/**
 * 收货评价生成器类
 */
export class ReviewGenerator {
  private client: OpenAI;
  private options: ReviewGeneratorOptions;

  /**
   * 创建一个收货评价生成器实例
   * @param options 配置选项
   */
  constructor(options: ReviewGeneratorOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.client = new OpenAI({
      apiKey: this.options.apiKey,
      baseURL: this.options.baseURL,
      dangerouslyAllowBrowser: true,
    });
  }

  /**
   * 生成产品收货评价
   * @param product 产品信息
   * @returns 生成的评价文本
   */
  async generateReview(product: Product): Promise<string> {
    const lengthDescription = {
      short: "简短",
      medium: "中等长度",
      long: "详细",
    }[this.options.length || "medium"];

    const sentimentDescription = {
      positive: "正面",
      neutral: "中性",
      negative: "负面",
    }[this.options.sentiment || "positive"];

    const featuresList = product.features ? product.features.join("、") : "";

    const prompt = `请你为以下产品生成一段${lengthDescription}的${sentimentDescription}收货评价，使用${
      this.options.language
    }:
    
产品名称: ${product.name}
${product.category ? `产品分类: ${product.category}` : ""}
${featuresList ? `产品特点: ${featuresList}` : ""}

评价要求:
1. 评价应当真实自然，像是真实用户写的
2. 包含对产品功能和质量的评价
3. 可以适当提到使用体验和收货物流
4. 避免过于营销化的语言`;

    try {
      const response = await this.client.chat.completions.create({
        model: this.options.model!,
        messages: [
          {
            role: "system",
            content: "你是一个能够生成真实、自然的产品收货评价的助手。",
          },
          { role: "user", content: prompt },
        ],
        temperature: this.options.temperature,
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("生成评价时出错:", error);
      throw new Error(`生成评价失败: ${(error as Error).message}`);
    }
  }

  /**
   * 批量生成多个产品的评价
   * @param products 产品列表
   * @returns 生成的评价列表
   */
  async generateBatchReviews(products: Product[]): Promise<string[]> {
    const reviews: string[] = [];

    for (const product of products) {
      const review = await this.generateReview(product);
      reviews.push(review);
    }

    return reviews;
  }
}

export default ReviewGenerator;
