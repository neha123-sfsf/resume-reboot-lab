import { toast } from "sonner";

const API_ENDPOINT = "https://404jobnotfound-nehapatil03.hf.space/analyze";

export type ApiMode = 
  | "upload" 
  | "ats_score" 
  | "resume_feedback" 
  | "job_recommendation"
  | "cover_letter"
  | "chatbot";

export interface ApiRequest {
  mode: ApiMode;
  resume_file?: string;
  file_bytes?: string;
  job_description?: string;
  application_status?: string;
  user_query?: string;
  job_id?: string; // ✅ Added job_id for cover letter requests
}

export interface ApiResponse {
  status: "success" | "error";
  data?: any;
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

export async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export async function callApi(request: ApiRequest): Promise<ApiResponse> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return { status: "success", data };
  } catch (error) {
    console.error("API call failed:", error);
    toast.error(`Request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function uploadResume(
  file: File, 
  jobDescription: string
): Promise<ApiResponse> {
  try {
    const base64String = await convertFileToBase64(file);
    
    return await callApi({
      mode: "upload",
      resume_file: file.name,
      file_bytes: base64String,
      job_description: jobDescription,
      application_status: "rejected" // Default status
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return { status: "error", message: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getATSScore(): Promise<ApiResponse> {
  return await callApi({ mode: "ats_score" });
}

export async function getResumeFeedback(): Promise<ApiResponse> {
  return await callApi({ mode: "resume_feedback" });
}

export async function getJobRecommendations(): Promise<ApiResponse> {
  return await callApi({ mode: "job_recommendation" });
}

export async function generateCoverLetter(
  jobTitle: string,
  companyName: string,
  jobDescription: string
): Promise<ApiResponse> {
  return await callApi({
    mode: "cover_letter",
    job_title: jobTitle,
    company_name: companyName,
    job_description: jobDescription,
  });
}

export async function sendChatbotQuery(query: string): Promise<ApiResponse> {
  return await callApi({
    mode: "chatbot",
    user_query: query
  });
}
