import { toast } from "sonner";

// 1. Configuration
export const API_BASE_URL = "https://nehapatil03-404jobnotfound.hf.space";
export const ANALYZE_ENDPOINT = `${API_BASE_URL}/analyze`;
export const UPLOAD_ENDPOINT = `${API_BASE_URL}/upload_resume`;
export const DOWNLOAD_ENDPOINT = `${API_BASE_URL}/download`;

// 2. Type Definitions
export type ApiMode = 
  | "ats_score" 
  | "resume_feedback" 
  | "job_recommendation"
  | "cover_letter"
  | "chatbot";

interface ApiResponse<T = any> {
  status: "success" | "error";
  data?: T;
  message?: string;
}

interface UploadResponse {
  message: string;
  resume_file: string;
  [key: string]: any;
}

// 3. Core API Handler
const handleApiError = (error: unknown, defaultMessage: string) => {
  const message = error instanceof Error ? error.message : defaultMessage;
  toast.error(message);
  console.error(message, error);
  return { status: "error" as const, message };
};

async function callApi<T = any>(
  endpoint: string,
  payload?: Record<string, any>,
  file?: File
): Promise<ApiResponse<T>> {
  const formData = new FormData();

  // ✅ Important: append the file first
  if (file) {
    formData.append("resume_file", file);
  }

  if (payload) {
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return {
      status: "success",
      data: await response.json(),
    };
  } catch (error) {
    return handleApiError(error, "API request failed");
  }
}

// 4. Service Methods
export const apiService = {
  uploadResume: async (
    file: File,
    jobDescription: string
  ): Promise<ApiResponse<UploadResponse>> =>
    callApi(UPLOAD_ENDPOINT, {
      jd_text: jobDescription,
      application_status: "rejected",
    }, file),

  getATSScore: async (): Promise<ApiResponse> =>
    callApi(ANALYZE_ENDPOINT, { mode: "ats_score" }),

  getResumeFeedback: async (): Promise<ApiResponse> =>
    callApi(ANALYZE_ENDPOINT, { mode: "resume_feedback" }),

  getJobRecommendations: async (): Promise<ApiResponse> =>
    callApi(ANALYZE_ENDPOINT, { mode: "job_recommendation" }),

  generateCoverLetter: async (): Promise<ApiResponse> =>
    callApi(ANALYZE_ENDPOINT, { mode: "cover_letter" }),

  sendChatbotQuery: async (query: string): Promise<ApiResponse> =>
    callApi(ANALYZE_ENDPOINT, { mode: "chatbot", user_query: query }),

  downloadFile: async (filename: string): Promise<Blob> => {
    try {
      const response = await fetch(`${DOWNLOAD_ENDPOINT}/${filename}`);
      if (!response.ok) throw new Error(`Download failed: ${response.status}`);
      return response.blob();
    } catch (error) {
      handleApiError(error, "Download failed");
      throw error;
    }
  },

  healthCheck: async (): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error(`Health check failed: ${response.status}`);
      return { status: "success", data: await response.json() };
    } catch (error) {
      return handleApiError(error, "Health check failed");
    }
  }
};
