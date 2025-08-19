import { loggerService } from '@logger'
import { GenerateImageParams, Model, Provider } from '@renderer/types'
import { SdkInstance, SdkParams, SdkRawOutput, SdkRawChunk, SdkMessageParam, SdkToolCall, SdkTool, SdkModel } from '@renderer/types/sdk'
import { MCPTool, MCPToolResponse, MCPCallToolResponse, ToolCallResponse } from '@renderer/types'
import { RequestTransformer, ResponseChunkTransformer } from '../types'
import { CompletionsContext } from '../../middleware/types'

import { BaseApiClient } from '../BaseApiClient'

const logger = loggerService.withContext('ZhipuAPIClient')

interface ZhipuImageGenerationRequest {
  model: string
  prompt: string
  n?: number
  size?: string
  quality?: string
  style?: string
  user?: string
}

interface ZhipuImageGenerationResponse {
  created: number
  data: Array<{
    url: string
  }>
  content_filter?: Array<{
    role: string
    level: number
  }>
}

export class ZhipuAPIClient extends BaseApiClient<
  SdkInstance,
  SdkParams,
  SdkRawOutput,
  SdkRawChunk,
  SdkMessageParam,
  SdkToolCall,
  SdkTool
> {
  constructor(provider: Provider) {
    super(provider)
  }

  override getBaseURL(): string {
    return this.provider.apiHost
  }

  override getClientCompatibilityType(_model?: Model): string[] {
    return ['ZhipuAPIClient']
  }

  // 实现必需的抽象方法
  async createCompletions(_payload: SdkParams, _options?: any): Promise<SdkRawOutput> {
    throw new Error('ZhipuAPIClient does not support text completions')
  }

  async getEmbeddingDimensions(_model?: Model): Promise<number> {
    throw new Error('ZhipuAPIClient does not support embeddings')
  }

  async listModels(): Promise<SdkModel[]> {
    throw new Error('ZhipuAPIClient does not support model listing')
  }

  async getSdkInstance(): Promise<SdkInstance> {
    throw new Error('ZhipuAPIClient does not support SDK instance')
  }

  getRequestTransformer(): RequestTransformer<SdkParams, SdkMessageParam> {
    throw new Error('ZhipuAPIClient does not support request transformation')
  }

  getResponseChunkTransformer(_ctx: CompletionsContext): ResponseChunkTransformer<SdkRawChunk> {
    throw new Error('ZhipuAPIClient does not support response chunk transformation')
  }

  convertMcpToolsToSdkTools(_mcpTools: MCPTool[]): SdkTool[] {
    throw new Error('ZhipuAPIClient does not support tool conversion')
  }

  convertSdkToolCallToMcp(_toolCall: SdkToolCall, _mcpTools: MCPTool[]): MCPTool | undefined {
    throw new Error('ZhipuAPIClient does not support tool call conversion')
  }

  convertSdkToolCallToMcpToolResponse(_toolCall: SdkToolCall, _mcpTool: MCPTool): ToolCallResponse {
    throw new Error('ZhipuAPIClient does not support tool call response conversion')
  }

  buildSdkMessages(
    _currentReqMessages: SdkMessageParam[],
    _output: SdkRawOutput | string | undefined,
    _toolResults: SdkMessageParam[],
    _toolCalls?: SdkToolCall[]
  ): SdkMessageParam[] {
    throw new Error('ZhipuAPIClient does not support message building')
  }

  estimateMessageTokens(_message: SdkMessageParam): number {
    throw new Error('ZhipuAPIClient does not support token estimation')
  }

  convertMcpToolResponseToSdkMessageParam(
    _mcpToolResponse: MCPToolResponse,
    _resp: MCPCallToolResponse,
    _model: Model
  ): SdkMessageParam | undefined {
    throw new Error('ZhipuAPIClient does not support tool response conversion')
  }

  extractMessagesFromSdkPayload(_sdkPayload: SdkParams): SdkMessageParam[] {
    throw new Error('ZhipuAPIClient does not support message extraction')
  }

  /**
   * 生成图像 - 实现BaseApiClient的generateImage方法
   * @param generateImageParams 图像生成参数
   * @returns 图像URL数组
   */
  override async generateImage(generateImageParams: GenerateImageParams): Promise<string[]> {
    const { model, prompt, imageSize, batchSize } = generateImageParams
    
    // 打印获取到的API key
    console.log('=== 智谱AI API Key 信息 ===')
    console.log('Provider API Key:', this.provider.apiKey)
    console.log('Provider API Host:', this.provider.apiHost)
    console.log('Base URL:', this.getBaseURL())
    console.log('==============================')
    
    // 准备智谱AI API请求参数
    const request: ZhipuImageGenerationRequest = {
      model,
      prompt,
      n: batchSize,
      size: imageSize,
      quality: 'standard',
      style: 'vivid'
    }

    const url = `${this.getBaseURL()}/images/generations`
    const headers = {
      'Authorization': `Bearer ${this.provider.apiKey}`,
      'Content-Type': 'application/json',
      ...this.defaultHeaders()
    }

    // 打印详细的API请求日志
    logger.debug('🚀 智谱AI绘图API请求详情:', {
      url,
      method: 'POST',
      headers: {
        ...headers,
        'Authorization': 'Bearer [HIDDEN]' // 隐藏API Key
      },
      requestBody: request
    })

    console.log('=== 智谱AI绘图API请求日志 ===')
    console.log('URL:', url)
    console.log('Method:', 'POST')
    console.log('Headers:', {
      ...headers,
      'Authorization': 'Bearer [HIDDEN]' // 隐藏API Key
    })
    console.log('Request Body:', JSON.stringify(request, null, 2))
    console.log('==============================')

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(request)
    })

    // 打印响应日志
    console.log('=== 智谱AI绘图API响应日志 ===')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    console.log('Response Body:', responseText)
    console.log('==============================')

    if (!response.ok) {
      logger.error('❌ 智谱AI图像生成API调用失败:', {
        status: response.status,
        statusText: response.statusText,
        error: responseText
      })

      throw new Error(`智谱AI图像生成失败: ${response.status} ${response.statusText} - ${responseText}`)
    }

    const result: ZhipuImageGenerationResponse = JSON.parse(responseText)
    
    // 检查内容过滤
    if (result.content_filter && result.content_filter.length > 0) {
      const filterInfo = result.content_filter[0]
      console.log('⚠️ 内容过滤信息:', filterInfo)
      
      // 如果内容被过滤，但状态码是200，说明可能生成了图像但内容有敏感词
      if (filterInfo.level > 1) {
        logger.warn('⚠️ 智谱AI内容过滤警告:', {
          role: filterInfo.role,
          level: filterInfo.level
        })
        
        // 如果生成了图像，仍然返回，但记录警告
        if (result.data && result.data.length > 0) {
          logger.debug('✅ 智谱AI图像生成成功（但有内容过滤）:', {
            created: result.created,
            imageCount: result.data.length,
            contentFilterLevel: filterInfo.level
          })
          return result.data.map(item => item.url)
        }
      }
    }

    logger.debug('✅ 智谱AI图像生成成功:', {
      created: result.created,
      imageCount: result.data?.length || 0
    })

    // 返回图像URL数组
    return result.data.map(item => item.url)
  }

  /**
   * 默认请求头
   */
  override defaultHeaders(): { 'HTTP-Referer': string; 'X-Title': string; 'X-Api-Key': string } {
    return {
      'HTTP-Referer': 'https://open.bigmodel.cn/',
      'X-Title': 'CherryStudio',
      'X-Api-Key': this.provider.apiKey
    }
  }
}
