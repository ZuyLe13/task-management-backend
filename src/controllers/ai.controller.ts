import { Request, Response } from 'express';
import axios from 'axios';
import config from '../config/config';

const OLLAMA_BASE_URL = config.ollamaUrl;
const DEFAULT_MODEL = 'llama3.2:1b';

const RECOMMENDED_MODELS = {
  fastest: 'qwen2:0.5b',
  balanced: 'llama3.2:1b',
  quality: 'llama3.2:3b'
};

export const generate = async (req: Request, res: Response) => {
  try {
    const { 
      prompt, 
      model = DEFAULT_MODEL, 
      stream = false,
      num_predict = 200,
      ...options 
    } = req.body;

    if (!prompt) {
      res.status(400).json({
        error: 'Prompt is required',
        message: 'Vui lòng cung cấp prompt trong request body'
      });
      return;
    }

    // Cấu hình request đến Ollama
    const ollamaPayload = {
      model: model,
      prompt: prompt,
      num_predict: num_predict,
      stream: stream,
      ...options
    };

    const ollamaResponse = await axios.post(
      `${OLLAMA_BASE_URL}/api/generate`,
      ollamaPayload,
      {
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      model: model,
      response: ollamaResponse.data.response,
      done: ollamaResponse.data.done,
      total_duration: ollamaResponse.data.total_duration,
      load_duration: ollamaResponse.data.load_duration,
      prompt_eval_count: ollamaResponse.data.prompt_eval_count,
      eval_count: ollamaResponse.data.eval_count,
      eval_duration: ollamaResponse.data.eval_duration
    });

  } catch (error: any) {
    console.error('Lỗi khi gọi Ollama:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: 'Service Unavailable',
        message: 'Không thể kết nối đến Ollama. Vui lòng kiểm tra Ollama đã được khởi động chưa.'
      });
      return
    }

    if (error.response) {
      res.status(error.response.status).json({
        error: 'Ollama Error',
        message: error.response.data?.error || error.message
      });
      return;
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Có lỗi xảy ra khi xử lý request'
    });
  }
}

export const chat = async (req: Request, res: Response) => {
  try {
    const { 
      message, 
      context = [], // lịch sử chat từ client
      model = DEFAULT_MODEL,
      system = "Bạn là một AI assistant thông minh và hữu ích.",
      max_tokens = 500,
      temperature = 0.7
    } = req.body;

    if (!message || message.trim() === '') {
      res.status(400).json({
        error: 'Message is required',
        message: 'Vui lòng cung cấp tin nhắn'
      });
      return;
    }

    // Tạo context từ lịch sử chat
    let contextPrompt = system + "\n\n";
    
    // Thêm lịch sử hội thoại từ client (chỉ lấy 10 tin nhắn gần nhất)
    const recentHistory = context.slice(-10);
    for (const msg of recentHistory) {
      contextPrompt += `Human: ${msg.user}\nAssistant: ${msg.assistant}\n\n`;
    }
    
    // Thêm tin nhắn hiện tại
    contextPrompt += `Human: ${message}\nAssistant: `;

    const startTime = Date.now();

    // Gọi Ollama API với stream = false
    const ollamaResponse = await axios.post(
      `${OLLAMA_BASE_URL}/api/generate`,
      {
        model: model,
        prompt: contextPrompt,
        stream: false, // Không stream
        options: {
          num_predict: max_tokens,
          temperature: temperature,
          stop: ["Human:", "User:"] // Dừng khi AI cố gắng nói thay user
        }
      },
      {
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const aiResponse = ollamaResponse.data.response.trim();

    // Trả về response hoàn chỉnh
    res.json({
      success: true,
      message: message,
      response: aiResponse,
      model: model,
      stats: {
        response_time_ms: responseTime,
        tokens_per_second: ollamaResponse.data.eval_count ? 
          Math.round((ollamaResponse.data.eval_count / ollamaResponse.data.eval_duration) * 1e9) : 0
      }
    });

  } catch (error: any) {
    console.error('Lỗi khi chat:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: 'Service Unavailable',
        message: 'Không thể kết nối đến Ollama'
      });
      return;
    }

    res.status(500).json({
      error: 'Chat Error',
      message: error.response?.data?.error || error.message
    });
  }
}

// Chat Stream API - Trả về response từng phần theo thời gian thực
export const chatStream = async (req: Request, res: Response) => {
  try {
    const { 
      message, 
      context = [],
      model = DEFAULT_MODEL,
      system = "Bạn là một AI assistant thông minh và hữu ích. Trả lời bằng tiếng Việt.",
      max_tokens = 500,
      temperature = 0.7
    } = req.body;

    if (!message || message.trim() === '') {
      res.status(400).json({
        error: 'Message is required',
        message: 'Vui lòng cung cấp tin nhắn'
      });
      return;
    }

    // Tạo context từ lịch sử chat
    let contextPrompt = system + "\n\n";
    
    // Thêm lịch sử hội thoại từ client (chỉ lấy 10 tin nhắn gần nhất)
    const recentHistory = context.slice(-10);
    for (const msg of recentHistory) {
      contextPrompt += `Human: ${msg.user}\nAssistant: ${msg.assistant}\n\n`;
    }
    
    // Thêm tin nhắn hiện tại
    contextPrompt += `Human: ${message}\nAssistant: `;

    // Thiết lập headers cho Server-Sent Events (SSE)
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    const startTime = Date.now();
    let fullResponse = '';

    try {
      // Gọi Ollama API với stream = true
      const ollamaResponse = await axios.post(
        `${OLLAMA_BASE_URL}/api/generate`,
        {
          model: model,
          prompt: contextPrompt,
          stream: true, // Bật streaming
          options: {
            num_predict: max_tokens,
            temperature: temperature,
            stop: ["Human:", "User:"]
          }
        },
        {
          timeout: 60000,
          responseType: 'stream',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Xử lý stream data từ Ollama
      ollamaResponse.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n');
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          
          try {
            const data = JSON.parse(line);
            
            if (data.response) {
              fullResponse += data.response;
              
              // Gửi chunk đến client qua SSE
              res.write(`data: ${JSON.stringify({
                type: 'chunk',
                content: data.response,
                done: data.done || false
              })}\n\n`);
            }
            
            // Khi hoàn thành
            if (data.done) {
              const endTime = Date.now();
              const responseTime = endTime - startTime;
              
              // Gửi thông tin cuối cùng
              res.write(`data: ${JSON.stringify({
                type: 'done',
                full_response: fullResponse.trim(),
                stats: {
                  response_time_ms: responseTime,
                  tokens_per_second: data.eval_count ? 
                    Math.round((data.eval_count / data.eval_duration) * 1e9) : 0
                }
              })}\n\n`);
              
              res.end();
            }
          } catch (parseError) {
            console.error('Lỗi parse JSON:', parseError);
          }
        }
      });

      ollamaResponse.data.on('end', () => {
        if (!res.headersSent) {
          res.end();
        }
      });

      ollamaResponse.data.on('error', (error: any) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.write(`data: ${JSON.stringify({
            type: 'error',
            message: 'Stream error occurred'
          })}\n\n`);
          res.end();
        }
      });

    } catch (streamError: any) {
      console.error('Lỗi khi stream:', streamError);
      if (!res.headersSent) {
        res.write(`data: ${JSON.stringify({
          type: 'error',
          message: streamError.message
        })}\n\n`);
        res.end();
      }
    }

  } catch (error: any) {
    console.error('Lỗi khi chat stream:', error.message);
    
    if (!res.headersSent) {
      if (error.code === 'ECONNREFUSED') {
        res.status(503).json({
          error: 'Service Unavailable',
          message: 'Không thể kết nối đến Ollama'
        });
      } else {
        res.status(500).json({
          error: 'Chat Stream Error',
          message: error.response?.data?.error || error.message
        });
      }
    }
  }
}