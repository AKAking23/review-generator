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
 * 寻源项目信息
 */
export interface SourcingProject {
  /**
   * 项目名称
   */
  name: string;
  /**
   * 合同类型
   */
  contractType: string;
  /**
   * 计划签约周期
   */
  contractPeriod: string;
  /**
   * 是否续签
   */
  isRenewal: boolean;
  /**
   * 寻源采购方式
   */
  sourcingMethod: string;
  /**
   * 其他相关信息
   */
  additionalInfo?: string;
}

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

  /**
   * 生成寻源采购策略
   * @param project 寻源项目信息
   * @returns 生成的采购策略文本
   */
  async generateSourcingStrategy(project: SourcingProject): Promise<string> {
    const prompt = `请根据以下寻源项目信息生成一份专业的寻源采购策略，使用${
      this.options.language
    }:
    
项目名称: ${project.name}
合同类型: ${project.contractType}
计划签约周期: ${project.contractPeriod}
是否续签: ${project.isRenewal ? '是' : '否'}
寻源采购方式: ${project.sourcingMethod}
${project.additionalInfo ? `其他信息: ${project.additionalInfo}` : ''}

策略要求:
1. 包含寻源背景分析
2. 详细的市场分析和供应商选择策略
3. 评估标准和谈判要点
4. 风险管理和应对措施
5. 具体实施计划和时间表建议`;

    try {
      const response = await this.client.chat.completions.create({
        model: this.options.model!,
        messages: [
          {
            role: "system",
            content: "你是一个专业的采购策略顾问，能够根据寻源项目基本信息生成详细的采购策略。",
          },
          { role: "user", content: prompt },
        ],
        temperature: this.options.temperature,
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("生成采购策略时出错:", error);
      throw new Error(`生成采购策略失败: ${(error as Error).message}`);
    }
  }

  /**
   * 批量生成多个寻源项目的采购策略
   * @param projects 寻源项目列表
   * @returns 生成的采购策略列表
   */
  async generateBatchSourcingStrategies(projects: SourcingProject[]): Promise<string[]> {
    const strategies: string[] = [];

    for (const project of projects) {
      const strategy = await this.generateSourcingStrategy(project);
      strategies.push(strategy);
    }

    return strategies;
  }
}

export default ReviewGenerator;
