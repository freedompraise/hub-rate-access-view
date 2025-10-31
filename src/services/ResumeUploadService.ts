import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filename?: string;
  path?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class ResumeUploadService {
  private static readonly MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
  private static readonly ALLOWED_TYPES = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  private static readonly ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];
  private static readonly BUCKET_NAME = 'Careers';

  /**
   * Validates file constraints
   */
  private static validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (file.type && !this.ALLOWED_TYPES.includes(file.type)) {
      // Fallback to extension check if MIME type is not reliable
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !this.ALLOWED_EXTENSIONS.includes(ext)) {
        return {
          valid: false,
          error: `Invalid file type. Only PDF, DOC, and DOCX files are allowed.`
        };
      }
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${this.MAX_FILE_SIZE / (1024 * 1024)}MB.`
      };
    }

    return { valid: true };
  }

  /**
   * Generates a unique filename with timestamp
   */
  private static generateFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${randomString}_${originalName}`;
  }


  /**
   * Uploads a resume file to Supabase Storage
   */
  static async uploadResume(file: File): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Generate filename and path
      const filename = this.generateFilename(file.name);
      const filePath = `resumes/${filename}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return {
          success: false,
          error: `Upload failed: ${error.message}`
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        return {
          success: false,
          error: 'Failed to get public URL'
        };
      }

      return {
        success: true,
        url: urlData.publicUrl,
        filename: filename,
        path: filePath
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Deletes a resume file from Supabase Storage
   */
  static async deleteResume(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        return {
          success: false,
          error: `Delete failed: ${error.message}`
        };
      }

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Gets file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Creates a preview URL for a file (for PDFs, this might not work in all browsers)
   */
  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revokes a preview URL to free memory
   */
  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}
