/**
 * Enhanced Error Handling Utility for EduTalk Chat System
 * 
 * Provides comprehensive error handling, retry logic, circuit breaker pattern,
 * and graceful degradation for chat functionality
 */

export class ChatError extends Error {
  constructor(message, code = 'CHAT_ERROR', statusCode = 500, context = {}) {
    super(message);
    this.name = 'ChatError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp
    };
  }
}

/**
 * Circuit Breaker for preventing cascading failures
 */
class CircuitBreaker {
  constructor(name, threshold = 5, resetTimeout = 60000) {
    this.name = name;
    this.threshold = threshold;
    this.resetTimeout = resetTimeout;
    this.failures = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async call(fn, ...args) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new ChatError(
          `${this.name} service temporarily unavailable`,
          'SERVICE_UNAVAILABLE',
          503,
          { service: this.name, state: this.state }
        );
      } else {
        this.state = 'HALF_OPEN';
      }
    }

    try {
      const result = await fn(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      console.warn(`Circuit breaker opened for ${this.name}, failures: ${this.failures}`);
    }
  }
}

// Circuit breakers for different services
const circuitBreakers = {
  mongodb: new CircuitBreaker('MongoDB', 5, 10000), // 더 많은 실패 허용, 빠른 복구
  supabase: new CircuitBreaker('Supabase', 5, 10000),
};

/**
 * Retry operation with exponential backoff
 */
export async function withRetry(operation, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx) or specific error codes
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      if (attempt === maxRetries) {
        console.error(`Operation failed after ${maxRetries} attempts:`, error);
        break;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Enhanced MongoDB operation with error handling
 */
export async function withMongoDB(operation, fallbackValue = null) {
  try {
    return await circuitBreakers.mongodb.call(operation);
  } catch (error) {
    console.error('MongoDB operation failed:', error);
    
    // Log structured error for monitoring
    logError('MONGODB_ERROR', error, {
      operation: operation.name || 'unknown',
      circuitState: circuitBreakers.mongodb.state
    });

    // Return fallback value for graceful degradation
    if (fallbackValue !== null) {
      console.warn('Using fallback value for MongoDB operation');
      return fallbackValue;
    }

    throw new ChatError(
      'Database operation failed',
      'DATABASE_ERROR',
      503,
      { service: 'MongoDB', originalError: error.message }
    );
  }
}

/**
 * Enhanced Supabase operation with error handling
 */
export async function withSupabase(operation, fallbackValue = null) {
  try {
    return await circuitBreakers.supabase.call(operation);
  } catch (error) {
    console.error('Supabase operation failed:', error);
    
    // Log structured error for monitoring
    logError('SUPABASE_ERROR', error, {
      operation: operation.name || 'unknown',
      circuitState: circuitBreakers.supabase.state
    });

    // Return fallback value for graceful degradation
    if (fallbackValue !== null) {
      console.warn('Using fallback value for Supabase operation');
      return fallbackValue;
    }

    throw new ChatError(
      'Realtime service temporarily unavailable',
      'REALTIME_ERROR',
      503,
      { service: 'Supabase', originalError: error.message }
    );
  }
}

/**
 * Validate chat operation parameters
 */
export function validateChatParams(params) {
  const errors = [];

  if (!params.chatRoomId) {
    errors.push('Chat room ID is required');
  }

  if (!params.userId) {
    errors.push('User ID is required');
  }

  if (params.message && typeof params.message !== 'string') {
    errors.push('Message must be a string');
  }

  if (params.message && params.message.trim().length === 0) {
    errors.push('Message cannot be empty');
  }

  if (params.message && params.message.length > 2000) {
    errors.push('Message too long (max 2000 characters)');
  }

  if (errors.length > 0) {
    throw new ChatError(
      'Invalid parameters',
      'VALIDATION_ERROR',
      400,
      { validationErrors: errors }
    );
  }
}

/**
 * Enhanced error logging with structured data
 */
export function logError(type, error, context = {}) {
  const logData = {
    timestamp: new Date().toISOString(),
    type,
    message: error.message,
    stack: error.stack,
    context,
    ...(error.code && { code: error.code }),
    ...(error.statusCode && { statusCode: error.statusCode })
  };

  // In production, this would send to monitoring service
  console.error('STRUCTURED_ERROR:', JSON.stringify(logData, null, 2));

  // Store error metrics for circuit breaker and monitoring
  if (global.errorMetrics) {
    global.errorMetrics[type] = (global.errorMetrics[type] || 0) + 1;
  }
}

/**
 * Handle API response errors consistently
 */
export function handleApiError(error, req = null) {
  // Log error with request context
  logError('API_ERROR', error, {
    method: req?.method,
    url: req?.url,
    userAgent: req?.headers?.['user-agent'],
    userId: req?.user?.sub
  });

  // Return appropriate error response
  if (error instanceof ChatError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      context: error.context
    };
  }

  // Handle common error types
  if (error.name === 'ValidationError') {
    return {
      error: 'Invalid input data',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details: error.message
    };
  }

  if (error.name === 'UnauthorizedError') {
    return {
      error: 'Authentication required',
      code: 'UNAUTHORIZED',
      statusCode: 401
    };
  }

  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return {
      error: 'Service temporarily unavailable',
      code: 'SERVICE_UNAVAILABLE',
      statusCode: 503
    };
  }

  // Generic server error
  return {
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  };
}

/**
 * Graceful degradation helper
 */
export function withFallback(primaryOperation, fallbackOperation, errorMessage = 'Primary service unavailable') {
  return async (...args) => {
    try {
      return await primaryOperation(...args);
    } catch (error) {
      console.warn(`${errorMessage}, using fallback:`, error.message);
      return await fallbackOperation(...args);
    }
  };
}

/**
 * Health check for chat services
 */
export async function checkChatHealthStatus() {
  const status = {
    timestamp: new Date().toISOString(),
    services: {},
    overall: 'healthy'
  };

  // Check MongoDB (server-side only)
  if (typeof window === 'undefined') {
    try {
      await circuitBreakers.mongodb.call(async () => {
        // Simple connection test
        const { getDatabase } = await import('./mongodb.js');
        await getDatabase();
      });
      status.services.mongodb = {
        status: 'healthy',
        circuitState: circuitBreakers.mongodb.state
      };
    } catch (error) {
      status.services.mongodb = {
        status: 'unhealthy',
        error: error.message,
        circuitState: circuitBreakers.mongodb.state
      };
      status.overall = 'degraded';
    }
  } else {
    status.services.mongodb = {
      status: 'client-side',
      message: 'MongoDB not available on client-side'
    };
  }

  // Check Supabase
  try {
    await circuitBreakers.supabase.call(async () => {
      const { realtimeChat } = await import('./supabase.js');
      if (!realtimeChat.isAvailable()) {
        throw new Error('Supabase not configured');
      }
    });
    status.services.supabase = {
      status: 'healthy',
      circuitState: circuitBreakers.supabase.state
    };
  } catch (error) {
    status.services.supabase = {
      status: 'unhealthy',
      error: error.message,
      circuitState: circuitBreakers.supabase.state
    };
    if (status.overall === 'healthy') status.overall = 'degraded';
  }

  return status;
}

/**
 * Reset circuit breakers (useful for testing or manual recovery)
 */
export function resetCircuitBreakers() {
  Object.values(circuitBreakers).forEach(breaker => {
    breaker.failures = 0;
    breaker.state = 'CLOSED';
    breaker.nextAttempt = Date.now();
  });
  console.log('All circuit breakers reset');
}