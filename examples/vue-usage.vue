<template>
  <div class="deepseek-review-generator">
    <h1>DeepSeek评价生成器示例 (Vue版)</h1>
    
    <div class="form-group">
      <label for="apiKey">DeepSeek API密钥:</label>
      <input type="text" id="apiKey" v-model="apiKey" placeholder="输入你的DeepSeek API密钥">
    </div>
    
    <div class="form-group">
      <label for="productName">产品名称:</label>
      <input type="text" id="productName" v-model="product.name" placeholder="例如: 无线蓝牙耳机">
    </div>
    
    <div class="form-group">
      <label for="productCategory">产品分类:</label>
      <input type="text" id="productCategory" v-model="product.category" placeholder="例如: 电子产品">
    </div>
    
    <div class="form-group">
      <label>产品特点:</label>
      <div class="features-container">
        <div class="feature-item" v-for="(feature, index) in product.features" :key="index">
          <input type="text" v-model="product.features[index]" placeholder="例如: 主动降噪">
          <button class="remove-feature" @click="removeFeature(index)">删除</button>
        </div>
      </div>
      <button @click="addFeature" style="margin-top: 5px;">添加特点</button>
    </div>
    
    <div class="form-group">
      <label for="sentiment">评价情感:</label>
      <select id="sentiment" v-model="options.sentiment">
        <option value="positive">正面</option>
        <option value="neutral">中性</option>
        <option value="negative">负面</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="length">评价长度:</label>
      <select id="length" v-model="options.length">
        <option value="short">简短</option>
        <option value="medium">中等</option>
        <option value="long">详细</option>
      </select>
    </div>
    
    <button @click="generateReview" :disabled="loading">
      {{ loading ? '生成中...' : '生成评价' }}
    </button>
    
    <div class="result" v-if="review">
      <h2>生成的评价:</h2>
      <p>{{ review }}</p>
    </div>

    <div class="error" v-if="error">
      <p>错误: {{ error }}</p>
    </div>
  </div>
</template>

<script>
// 导入方式1：如果使用的是Vue CLI或webpack设置
// npm install deepseek-review-generator
import { ReviewGenerator } from 'deepseek-review-generator';

// 导入方式2：如果使用的是CDN，在index.html中添加：
// <script src="https://cdn.jsdelivr.net/npm/deepseek-review-generator/dist/index.js"></script>
// 然后这里不需要import语句

export default {
  name: 'DeepseekReviewGenerator',
  data() {
    return {
      apiKey: '',
      product: {
        name: '',
        category: '',
        features: ['']
      },
      options: {
        sentiment: 'positive',
        length: 'medium',
        language: '中文',
        temperature: 0.7
      },
      review: '',
      error: '',
      loading: false
    };
  },
  methods: {
    addFeature() {
      this.product.features.push('');
    },
    removeFeature(index) {
      this.product.features = this.product.features.filter((_, i) => i !== index);
      
      // 确保至少有一个特点输入框
      if (this.product.features.length === 0) {
        this.product.features = [''];
      }
    },
    async generateReview() {
      if (!this.apiKey) {
        this.error = '请输入DeepSeek API密钥';
        return;
      }
      
      if (!this.product.name) {
        this.error = '请输入产品名称';
        return;
      }
      
      this.error = '';
      this.loading = true;
      
      try {
        // 过滤掉空的特点
        const filteredFeatures = this.product.features.filter(f => f.trim() !== '');
        
        // 准备产品数据
        const productData = {
          name: this.product.name,
          category: this.product.category || undefined,
          features: filteredFeatures.length > 0 ? filteredFeatures : undefined
        };
        
        // 创建评价生成器实例
        const reviewGenerator = new ReviewGenerator({
          apiKey: this.apiKey,
          sentiment: this.options.sentiment,
          length: this.options.length,
          language: this.options.language,
          temperature: this.options.temperature
        });
        
        // 生成评价
        this.review = await reviewGenerator.generateReview(productData);
      } catch (err) {
        this.error = `生成评价失败: ${err.message}`;
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.deepseek-review-generator {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.error {
  margin-top: 20px;
  padding: 15px;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.features-container {
  display: flex;
  flex-direction: column;
}

.feature-item {
  display: flex;
  margin-bottom: 5px;
}

.feature-item input {
  flex: 1;
  margin-right: 5px;
}

.remove-feature {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
</style> 