import { toast } from "sonner";

// Base URL with /api prefix for Hugging Face Spaces
const API_BASE_URL = "https://nehapatil03-404jobnotfound.hf.space/api";
const ANALYZE_ENDPOINT = `${API_BASE_URL}/analyze`;
const DOWNLOAD_ENDPOINT = `${API_BASE_URL}/download`;

export type ApiMode = 
  | "upload" 
  | "ats_score" 
  | "resume_feedback" 
  | "job_recommendation"
  | "cover_letter"
  | "chatbot";

export interface ApiResponse<T = any> {
  status: "success" | "error";
  data?: T;
  message?: string;
}

export interface ATSScoreData {
  score: number;
  matched_keywords: string[];
  missed_keywords: string[];
  tips: string[];
}

export interface ResumeFeedbackData {
  format_score: number;
  parsing_score: number;
  feedback_points: {
    type: "success" | "warning" | "error";
    message: string;
  }[];
  improvement_suggestions: string[];
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  datePosted: string;
  summary: string;
  matchScore: number;
  coverLetterUrl?: string;
}

export interface CoverLetterResponse {
  text: string;
  download_url: string;
}

/**
 * Makes API calls to the FastAPI backend
 */
async function callApi(
  mode: ApiMode,
  formData: FormData
): Promise<ApiResponse> {
  try {
    // Always include the mode in the FormData
    formData.append("mode", mode);

    const response = await fetch(ANALYZE_ENDPOINT, {
      method: "POST",
      body: formData,
      // Let browser set Content-Type with boundary
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return {
      status: "success",
      data: await response.json(),
    };
  } catch (error) {
    console.error("API call failed:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    toast.error(`Request failed: ${message}`);
    return { status: "error", message };
  }
}

/**
 * Uploads resume and analyzes it
 */
export async function uploadResume(
  file: File,
  jobDescription: string,
  applicationStatus = "rejected"
): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("resume_file", file);
  formData.append("job_description", jobDescription);
  formData.append("application_status", applicationStatus);

  return callApi("upload", formData);
}

/**
 * Gets ATS score analysis
 */
export async function getATSScore(): Promise<ApiResponse<ATSScoreData>> {
  return callApi("ats_score", new FormData());
}

/**
 * Gets resume feedback
 */
export async function getResumeFeedback(): Promise<ApiResponse<ResumeFeedbackData>> {
  return callApi("resume_feedback", new FormData());
}

/**
 * Gets job recommendations
 */
export async function getJobRecommendations(): Promise<ApiResponse<JobRecommendation[]>> {
  return callApi("job_recommendation", new FormData());
}

/**
 * Generates a cover letter
 */
export async function generateCoverLetter(
  jobTitle: string,
  companyName: string,
  jobDescription: string
): Promise<ApiResponse<CoverLetterResponse>> {
  const formData = new FormData();
  formData.append("job_title", jobTitle);
  formData.append("company_name", companyName);
  formData.append("job_description", jobDescription);

  return callApi("cover_letter", formData);
}

/**
 * Sends query to chatbot
 */
export async function sendChatbotQuery(
  query: string
): Promise<ApiResponse<string>> {
  const formData = new FormData();
  formData.append("user_query", query);

  return callApi("chatbot", formData);
}

/**
 * Downloads generated file
 */
export async function downloadFile(filename: string): Promise<Blob> {
  try {
    const response = await fetch(`${DOWNLOAD_ENDPOINT}/${filename}`);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }
    return await response.blob();
  } catch (error) {
    console.error("Download failed:", error);
    const message = error instanceof Error ? error.message : "Download failed";
    toast.error(message);
    throw error;
  }
}

/**
 * Health check
 */
export async function healthCheck(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return {
      status: "success",
      data: await response.json(),
    };
  } catch (error) {
    console.error("Health check failed:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Health check failed",
    };
  }
}