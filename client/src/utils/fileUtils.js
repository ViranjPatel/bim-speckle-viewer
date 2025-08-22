/**
 * Utility functions for file handling
 */

/**
 * Format file size in human readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} File extension including dot
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
};

/**
 * Check if file type is supported
 * @param {string} filename - The filename
 * @param {Array} supportedFormats - Array of supported extensions
 * @returns {boolean} True if supported
 */
export const isFileTypeSupported = (filename, supportedFormats = []) => {
  const extension = `.${getFileExtension(filename)}`;
  return supportedFormats.includes(extension);
};

/**
 * Validate file before upload
 * @param {File} file - File object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 100 * 1024 * 1024, // 100MB default
    supportedFormats = [],
    requiredFields = ['name', 'size', 'type']
  } = options;
  
  const errors = [];
  
  // Check required fields
  requiredFields.forEach(field => {
    if (!file[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`);
  }
  
  // Check file type
  if (supportedFormats.length > 0 && !isFileTypeSupported(file.name, supportedFormats)) {
    errors.push(`File type not supported. Supported formats: ${supportedFormats.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate unique filename
 * @param {string} originalName - Original filename
 * @returns {string} Unique filename
 */
export const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  const baseName = originalName.replace(`.${extension}`, '');
  
  return `${baseName}_${timestamp}_${random}.${extension}`;
};

/**
 * Parse file metadata
 * @param {File} file - File object
 * @returns {Object} Parsed metadata
 */
export const parseFileMetadata = (file) => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    extension: getFileExtension(file.name),
    lastModified: file.lastModified ? new Date(file.lastModified) : null,
    webkitRelativePath: file.webkitRelativePath || null
  };
};

/**
 * Create file preview URL
 * @param {File} file - File object
 * @returns {string} Preview URL
 */
export const createFilePreview = (file) => {
  if (file.type.startsWith('image/')) {
    return URL.createObjectURL(file);
  }
  return null;
};

/**
 * Clean up preview URL
 * @param {string} url - Preview URL to clean up
 */
export const cleanupFilePreview = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};