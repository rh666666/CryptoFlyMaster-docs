<template>
  <div class="crypto-tool">
    <!-- 算法选择 -->
    <div class="algorithm-category">
      <h4>选择加解密算法</h4>
      <div v-for="(category, index) in algorithmCategories" :key="index">
        <h5>{{ category.name }}</h5>
        <div class="algorithm-buttons">
          <button 
            :class="['algorithm-btn', { active: selectedAlgorithm === alg.value }]"
            @click="selectAlgorithm(alg.value)"
            v-for="(alg, algIndex) in category.algorithms" 
            :key="algIndex"
          >
            {{ alg.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 输入输出区域 -->
    <div class="input-output">
      <!-- 当前算法信息 -->
      <div class="algorithm-info">
        <p>当前选择：{{ selectedAlgorithmName }}</p>
        <p v-html="algorithmTips[selectedAlgorithm] || '请选择算法查看说明'"></p>
      </div>

      <!-- 输入框 -->
      <div class="form-group">
        <label>输入内容：</label>
        <textarea 
          v-model="plaintext" 
          placeholder="请输入需要加解密的内容"
          :rows="4"
          :disabled="plaintextDisabled"
        ></textarea>
      </div>

      <div class="form-group">
        <label>输入密钥：</label>
        <textarea 
          v-model="key" 
          :placeholder="keyPlaceholder"
          :rows="4"
          :disabled="keyDisabled"
        ></textarea>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <button 
          @click="handleEncrypt"
          :disabled="!canOperate"
        >
          加密
        </button>
        <button 
          @click="handleDecrypt"
          :disabled="!canOperate"
        >
          解密
        </button>
      </div>

      <!-- 输出结果 -->
      <div class="output">
        <label>结果：</label>
        <textarea 
          :value="output" 
          readonly
          :rows="4"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedAlgorithm: '',
      plaintext: '',
      key: '',
      output: '',
      algorithmCategories: [
        {
          name: '古典密码',
          algorithms: [
            { name: 'Affine 仿射密码', value: 'affine' },
            { name: 'Hill 密码', value: 'hill' },
            { name: '单表代替 密码', value: 'keyed_sub' },
            { name: 'Playfair 密码', value: 'playfair' },
            { name: 'Vigenère 维几尼亚密码', value: 'vigenere' }
          ]
        },
        {
          name: '对称加密',
          algorithms: [
            { name: 'AES', value: 'aes' },
            { name: 'DES', value: 'des' },
            { name: 'SM4', value: 'sm4' },
            { name: 'RC4', value: 'rc4' },
            { name: '祖冲之 算法', value: 'zuc' }
          ]
        },
        {
          name: '哈希算法',
          algorithms: [
            { name: 'SHA-1', value: 'sha1' },
            { name: 'SM3', value: 'sm3' }
          ]
        }
      ],
      algorithmTips: {
        affine: "输入明文格式：26个英文字母 eg. china<br>输入密钥格式：两个整数，空格分隔 eg. 7 3<br>（两个整数的第一个整数与26互质时，才可解密）<br>Affine 加密是一种古典加密方法，通过线性变换对明文进行加密，需要两个密钥（加法密钥和乘法密钥）。",
        hill: "输入明文格式：26个英文字母 eg. hi<br>输入密钥格式：一个矩阵，每一行每个元素用空格分隔，每一行之间用英文逗号分隔,最后用%加上填充字符, eg. 11 8,3 7%a（注：解密时不需要填充字符，所以需去掉%a）<br>Hill 密码要求将明文分成固定长度的分组（最后一个分组可能需要填充)，每个分组整体加密变换。",
        keyed_sub: "输入明文格式：26个英文字母 eg.hello world!<br>输入密钥格式：一个字符串，长度必须小于等于明文长度 eg.key<br>单表代替密码，通过指定的替换表对字符进行替换。",
        playfair: "输入明文格式：26个英文字母 eg.playfair cipher<br>输入密钥格式：一个字符串和一个填充字符，用英文逗号分隔 eg.PLAYFAIR　IS　A　DIGRAM　CIPHER,a<br>Playfair 加密是基于矩阵的双字母加密方法，主要用于提高单字母替换的安全性。",
        vigenere: "输入明文格式：26个英文字母 eg.data security<br>输入密钥格式：一个字符串 eg.best<br>Vigenère 加密是一种基于字母表的多表加密算法，使用密钥控制每个字符的替换。",
        aes: "输入明文格式：任意长度字符串 eg.hello world!<br>输入密钥格式：16个字符 eg.1234567890123456<br>AES（高级加密标准）是一种对称加密算法，具有高安全性和高效率，适合保护敏感数据。<br>(注：我们对输入认为是utf-8编码的，所以如果测试书上或者ppt上十六进制的例子，得先把16禁止转化为ASCII字符，这样加密后的结果才和书上或者ppt上的是一致的。)",
        des: "输入明文格式：任意长度字符串 eg.hello world!<br>输入密钥格式：8个字符 eg.1234abcd<br>DES（数据加密标准）是一种对称加密算法，曾广泛用于商业加密，但已被 AES 替代。<br>(注：我们对输入认为是utf-8编码的，所以如果测试书上或者ppt上十六进制的例子，得先把16禁止转化为ASCII字符，这样加密后的结果才和书上或者ppt上的是一致的。)",
        sm4: "输入明文格式：任意长度字符串 eg.hello world!<br>输入密钥格式：16个字符 eg.1234567890123456<br>SM4 是中国自主研发的对称加密算法，广泛用于国内数据安全场景。",
        rc4: "输入明文格式：任意长度字符串 eg.hello world!<br>输入密钥格式：任意长度字符串 eg.1234abcd<br>RC4 是一种流加密算法，适合快速加解密，但因安全问题逐渐被淘汰。",
        sha1: "输入明文格式：一个字符串 eg.hello world!<br>SHA-1 是一种哈希算法，用于生成数据的摘要，但安全性较低，已不建议使用。(单向加密，不可逆加密)",
        sm3: "输入明文格式：任意长度字符串 eg.hello world!<br>SM3 是中国自主研发的哈希算法，适合生成数据摘要，安全性较高。（单向加密，不可逆加密）",
        zuc: "输入明文格式：一个字符串 eg.133333ACCBACBACBABCABCABCBACBABCABCABCBACBABBABCBACBABCABCB<br>输入密钥格式：一个字符串和一个iv，用英文逗号分隔 eg.1111,acd<br>祖冲之 序列密码算法是我国发布的商用密码算法中的序列密码算法。<br>(！！！注：因技术问题暂不可用（服务器会爆炸），若要使用，请移步<a href='https://seehttps.com/gm/zuc256'>这里</a>！！！)"
      },
      backendUrl: 'https://flask.xn--15t7v.icu'
    }
  },
  computed: {
    selectedAlgorithmName() {
      return this.algorithmCategories.flatMap(c => c.algorithms)
        .find(a => a.value === this.selectedAlgorithm)?.name || '请选择算法'
    },
    keyPlaceholder() {
      if (['affine'].includes(this.selectedAlgorithm)) {
        return '请输入两个密钥（用空格分隔）';
      } else if (['aes', 'des', 'sm4'].includes(this.selectedAlgorithm)) {
        return '请输入一个密钥';
      } else if (['sha1', 'sm3'].includes(this.selectedAlgorithm)) {
        return '散列算法无需输入密钥';
      } else if (this.selectedAlgorithm === 'hill') {
        return '请输入一个密钥矩阵，一行每个元素用空格分隔，每一行之间用英文逗号分隔,最后用%加上填充字符';
      } else if (this.selectedAlgorithm === 'playfair') {
        return '请输入密钥和规定的填充字符（用英文逗号分隔）';
      } else if (this.selectedAlgorithm === 'zuc') {
        return '因技术问题，暂不可用';
      }
      return '请输入一个密钥';
    },
    plaintextDisabled() {
      return ['zuc'].includes(this.selectedAlgorithm);
    },
    keyDisabled() {
      return ['sha1', 'sm3', 'zuc'].includes(this.selectedAlgorithm);
    },
    canOperate() {
      return this.selectedAlgorithm && this.plaintext && 
        (!['sha1', 'sm3'].includes(this.selectedAlgorithm) || !this.key);
    }
  },
  methods: {
    selectAlgorithm(alg) {
      this.selectedAlgorithm = alg;
      this.plaintext = '';
      this.key = '';
      this.output = '';
    },

    async handleEncrypt() {
      if (!this.selectedAlgorithm) {
        alert('请先选择加密算法！');
        return;
      }
      if (!this.plaintext) {
        alert('请输入明文数据！');
        return;
      }
      if (!['sha1', 'sm3'].includes(this.selectedAlgorithm) && !this.key) {
        alert('请输入密钥！');
        return;
      }
      await this.processRequest('encrypt');
    },

    async handleDecrypt() {
      if (!this.selectedAlgorithm) {
        alert('请先选择解密算法！');
        return;
      }
      if (!this.plaintext) {
        alert('请输入需要解密的数据！');
        return;
      }
      if (!['sha1', 'sm3'].includes(this.selectedAlgorithm) && !this.key) {
        alert('请输入密钥！');
        return;
      }
      await this.processRequest('decrypt');
    },

    async processRequest(type) {
      try {
        const response = await fetch(`${this.backendUrl}/${type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            algorithm: this.selectedAlgorithm,
            data: this.plaintext,
            key: this.key
          })
        });

        const result = await response.json();
        this.output = result.result || '处理失败，请检查参数';
      } catch (error) {
        this.output = '网络请求失败，请检查连接';
      }
    }
  }
}
</script>

<style scoped>
/* 整体容器样式 */
.crypto-tool {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

/* 算法选择区域样式 */
.algorithm-category {
  flex: 1 1 300px;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.algorithm-category h4 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  border-bottom: 2px solid;
  padding-bottom: 5px;
}

.algorithm-buttons {
  display: flex;
  flex-wrap: wrap;
}

.algorithm-btn {
  margin: 5px;
  padding: 8px 15px;
  border: 1px solid;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.algorithm-btn.active {
  background: #007bff;
  border-color: #007bff;
}

.algorithm-btn:hover {
  background: #e2e6ea;
}

/* 输入输出区域样式 */
.input-output {
  flex: 2 1 600px;
  margin-top: 0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid;
  border-radius: 5px;
  resize: vertical;
  transition: border-color 0.3s ease;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.button-group {
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease;
}

button:hover {
  background: #0056b3;
}

button:disabled {
  background: #ddd;
  cursor: not-allowed;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .crypto-tool {
    flex-direction: column;
  }

  .algorithm-category,
  .input-output {
    flex: 1 1 auto;
  }
}
</style>    