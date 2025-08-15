/**
 * 智谱错误测试工具
 * 使用方法：
 * 1. 在浏览器控制台中运行
 * 2. 选择智谱模型
 * 3. 发送消息测试错误
 */

export const ZhipuErrorTest = {
  /**
   * 测试API Key未配置错误
   */
  testNoApiKey() {
    localStorage.setItem('test_zhipu_error', 'no_api_key')
    console.log('✅ 已设置测试：API Key未配置错误')
    console.log('💡 现在选择智谱模型并发送消息来测试')
  },

  /**
   * 测试余额不足错误
   */
  testInsufficientBalance() {
    localStorage.setItem('test_zhipu_error', 'insufficient_balance')
    console.log('✅ 已设置测试：余额不足错误')
    console.log('💡 现在选择智谱模型并发送消息来测试')
  },

  /**
   * 测试免费配额用尽错误
   */
  testQuotaExceeded() {
    localStorage.setItem('test_zhipu_error', 'quota_exceeded')
    console.log('✅ 已设置测试：免费配额用尽错误')
    console.log('💡 现在选择智谱模型并发送消息来测试')
  },

  /**
   * 清除测试模式
   */
  clearTest() {
    localStorage.removeItem('test_zhipu_error')
    console.log('✅ 已清除测试模式')
    console.log('💡 现在可以正常使用智谱模型了')
  },

  /**
   * 显示当前测试状态
   */
  getStatus() {
    const testError = localStorage.getItem('test_zhipu_error')
    if (testError) {
      console.log(`🔧 当前测试模式：${testError}`)
      console.log('⚠️  注意：测试模式会影响智谱模型的正常使用')
      console.log('💡 测试完成后请运行 ZhipuErrorTest.clearTest() 清除测试模式')
    } else {
      console.log('🔧 当前无测试模式')
      console.log('✅ 智谱模型可以正常使用')
    }
  },

  /**
   * 测试翻译是否正常工作
   */
  testTranslation() {
    try {
      // 尝试直接访问翻译
      const i18n = require('i18next')
      console.log('🔧 测试智谱错误翻译：')
      console.log('error.zhipu.no_api_key:', i18n.t('error.zhipu.no_api_key'))
      console.log('error.zhipu.insufficient_balance:', i18n.t('error.zhipu.insufficient_balance'))
      console.log('error.zhipu.quota_exceeded:', i18n.t('error.zhipu.quota_exceeded'))

      // 检查翻译是否存在
      console.log('🔧 检查翻译键是否存在：')
      console.log('error.zhipu.no_api_key exists:', i18n.exists('error.zhipu.no_api_key'))
      console.log('error.zhipu.insufficient_balance exists:', i18n.exists('error.zhipu.insufficient_balance'))
      console.log('error.zhipu.quota_exceeded exists:', i18n.exists('error.zhipu.quota_exceeded'))
    } catch (error) {
      console.error('❌ 翻译测试失败:', error)
    }
  },

  /**
   * 检查当前语言和翻译状态
   */
  checkLanguage() {
    try {
      const i18n = require('i18next')
      console.log('🔧 当前语言检查：')
      console.log('当前语言:', i18n.language)
      console.log('localStorage语言:', localStorage.getItem('language'))
      console.log('navigator语言:', navigator.language)
      console.log('可用语言:', Object.keys(i18n.options.resources))

      // 检查中文翻译
      console.log('🔧 中文翻译检查：')
      const zhCN = i18n.options.resources['zh-CN']?.translation?.error?.zhipu
      console.log('zh-CN翻译:', zhCN)

      // 检查英文翻译
      console.log('🔧 英文翻译检查：')
      const enUS = i18n.options.resources['en-US']?.translation?.error?.zhipu
      console.log('en-US翻译:', enUS)

      // 测试翻译键
      console.log('🔧 翻译键测试：')
      console.log('error.zhipu.no_api_key exists:', i18n.exists('error.zhipu.no_api_key'))
      console.log('error.zhipu.no_api_key value:', i18n.t('error.zhipu.no_api_key'))
    } catch (error) {
      console.error('❌ 语言检查失败:', error)
    }
  },

  /**
   * 显示所有可用的测试命令
   */
  help() {
    console.log(`
🔧 智谱错误测试工具使用说明：

1. 设置测试模式：
   ZhipuErrorTest.testNoApiKey()        // 测试API Key未配置
   ZhipuErrorTest.testInsufficientBalance()  // 测试余额不足
   ZhipuErrorTest.testQuotaExceeded()   // 测试配额用尽

2. 查看状态：
   ZhipuErrorTest.getStatus()           // 查看当前测试状态

3. 测试翻译：
   ZhipuErrorTest.testTranslation()     // 测试翻译是否正常

4. 清除测试：
   ZhipuErrorTest.clearTest()           // 清除测试模式

5. 显示帮助：
   ZhipuErrorTest.help()                // 显示此帮助信息

💡 使用步骤：
1. 运行测试命令设置错误类型
2. 选择智谱模型（如GLM-4.5）
3. 发送消息
4. 查看错误提示和可点击链接
5. 测试完成后清除测试模式
    `)
  }
}

// 将测试工具添加到全局对象，方便在控制台中使用
if (typeof window !== 'undefined') {
  ;(window as any).ZhipuErrorTest = ZhipuErrorTest
  console.log('🔧 智谱错误测试工具已加载！')
  console.log('💡 运行 ZhipuErrorTest.help() 查看使用说明')
}
